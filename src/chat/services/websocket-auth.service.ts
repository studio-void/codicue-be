import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Payload } from '../../auth/jwt/jwt.payload';
import {
  AuthenticatedSocket,
  AuthenticatedUser,
  AuthenticationResult,
  ErrorResponse,
} from '../types/chat.types';

@Injectable()
export class WebSocketAuthService {
  private readonly logger = new Logger(WebSocketAuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async authenticateSocket(
    client: AuthenticatedSocket,
  ): Promise<AuthenticationResult> {
    try {
      const authToken = this.extractToken(client);
      if (!authToken) {
        return {
          success: false,
          error: 'Authentication token required',
        };
      }

      const payload = this.verifyToken(authToken);
      if (!payload) {
        return {
          success: false,
          error: 'Invalid token',
        };
      }

      const user = await this.findUser(payload.id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      this.attachUserToSocket(client, user);

      this.logger.log(`User authenticated: ${user.userType} ${user.id}`);

      return {
        success: true,
        user,
      };
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  private extractToken(client: AuthenticatedSocket): string | null {
    return (client.handshake.auth?.token as string) || null;
  }

  private verifyToken(token: string): Payload | null {
    try {
      return this.jwtService.verify<Payload>(token);
    } catch (error) {
      this.logger.error('JWT verification failed:', error);
      return null;
    }
  }

  private async findUser(userId: number): Promise<AuthenticatedUser | null> {
    // Try to find user first
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      return {
        id: user.id,
        userType: 'user',
        email: user.email,
      };
    }

    // If not found, try to find stylist
    const stylist = await this.prisma.stylist.findUnique({
      where: { id: userId },
    });

    if (stylist) {
      return {
        id: stylist.id,
        userType: 'stylist',
        email: stylist.email,
      };
    }

    return null;
  }

  private attachUserToSocket(
    client: AuthenticatedSocket,
    user: AuthenticatedUser,
  ): void {
    if (!client.data) {
      client.data = { user: {} as AuthenticatedUser };
    }
    client.data.user = user;
  }

  emitError(client: AuthenticatedSocket, error: string): void {
    const errorResponse: ErrorResponse = { message: error };
    client.emit('error', errorResponse);
  }

  disconnectWithError(client: AuthenticatedSocket, error: string): void {
    this.emitError(client, error);
    client.disconnect();
  }
}
