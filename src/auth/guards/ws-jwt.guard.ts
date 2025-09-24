import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service';
import { Payload } from '../jwt/jwt.payload';

interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      id: number;
      userType: 'user' | 'stylist';
      email: string;
    };
  };
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<AuthenticatedSocket>();
      const authToken = client.handshake.auth?.token as string;

      console.log('WsJwtGuard: Auth token received:', authToken ? 'YES' : 'NO');

      if (!authToken) {
        console.log('WsJwtGuard: No token provided');
        throw new WsException('Authentication token not provided');
      }

      const payload = this.jwtService.verify<Payload>(authToken);
      console.log('WsJwtGuard: Token verified, user ID:', payload.id);

      // 사용자 정보 조회 및 검증
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        const stylist = await this.prisma.stylist.findUnique({
          where: { id: payload.id },
        });

        if (!stylist) {
          throw new WsException('User not found');
        }

        client.data.user = {
          id: stylist.id,
          userType: 'stylist',
          email: stylist.email,
        };
        console.log('WsJwtGuard: Stylist authenticated:', stylist.id);
      } else {
        client.data.user = {
          id: user.id,
          userType: 'user',
          email: user.email,
        };
        console.log('WsJwtGuard: User authenticated:', user.id);
      }

      return true;
    } catch (error) {
      console.log('WsJwtGuard: Error:', error);
      throw new WsException('Invalid token');
    }
  }
}
