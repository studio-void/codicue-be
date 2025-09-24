import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

import {
  AuthenticatedSocket,
  JoinChatPayload,
  SendMessagePayload,
  MessageFromUser,
  MessageFromStylist,
  NewMessageResponse,
} from './types/chat.types';
import { WebSocketAuthService } from './services/websocket-auth.service';
import { WebSocketResponseHelper } from './utils/websocket-response.helper';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly webSocketAuthService: WebSocketAuthService,
  ) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);

    const authResult =
      await this.webSocketAuthService.authenticateSocket(client);

    if (!authResult.success) {
      this.webSocketAuthService.disconnectWithError(
        client,
        authResult.error || 'Authentication failed',
      );
      return;
    }

    WebSocketResponseHelper.emitConnectionSuccess(
      client,
      authResult.user!.id,
      authResult.user!.userType,
    );
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private isAuthenticated(client: AuthenticatedSocket): boolean {
    return !!client.data?.user;
  }

  private async getChatForUser(
    chatId: number,
    user: { id: number; userType: 'user' | 'stylist' },
  ) {
    if (user.userType === 'user') {
      return await this.chatService.getChatByIdForUser(chatId, user.id);
    } else {
      return await this.chatService.getChatByIdForStylist(chatId, user.id);
    }
  }

  private async sendMessageAndGetResponse(
    chatId: number,
    user: { id: number; userType: 'user' | 'stylist' },
    content: string,
  ): Promise<NewMessageResponse> {
    if (user.userType === 'user') {
      const message = (await this.chatService.sendMessageFromUser(
        chatId,
        user.id,
        content,
      )) as MessageFromUser;

      return {
        id: message.id,
        content: message.content,
        chatId: message.chatId,
        senderId: message.senderId,
        senderType: user.userType,
        senderName: message.user.name,
        createdAt: message.createdAt,
        isFromUser: message.isFromUser,
      };
    } else {
      const message = (await this.chatService.sendMessageFromStylist(
        chatId,
        user.id,
        content,
      )) as MessageFromStylist;

      return {
        id: message.id,
        content: message.content,
        chatId: message.chatId,
        senderId: message.stylistId,
        senderType: user.userType,
        senderName: message.stylist.name,
        createdAt: message.createdAt,
        isFromUser: message.isFromUser,
      };
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() payload: JoinChatPayload,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    try {
      const { chatId } = payload;

      if (!this.isAuthenticated(client)) {
        WebSocketResponseHelper.emitError(client, 'Authentication required');
        return;
      }

      const { user } = client.data;
      const chat = await this.getChatForUser(chatId, user);

      if (!chat) {
        WebSocketResponseHelper.emitError(
          client,
          'Chat not found or access denied',
        );
        return;
      }

      await client.join(`chat-${chatId}`);
      WebSocketResponseHelper.emitChatJoined(client, chatId);

      this.logger.log(
        `User ${user.id} (${user.userType}) joined chat ${chatId}`,
      );
    } catch (error) {
      WebSocketResponseHelper.handleError(
        this.logger,
        client,
        error,
        'Join chat',
        'Failed to join chat',
      );
    }
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() payload: JoinChatPayload,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    try {
      const { chatId } = payload;

      if (!this.isAuthenticated(client)) {
        WebSocketResponseHelper.emitError(client, 'Authentication required');
        return;
      }

      await client.leave(`chat-${chatId}`);
      WebSocketResponseHelper.emitChatLeft(client, chatId);

      this.logger.log(`User ${client.data.user.id} left chat ${chatId}`);
    } catch (error) {
      WebSocketResponseHelper.handleError(
        this.logger,
        client,
        error,
        'Leave chat',
        'Failed to leave chat',
      );
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    try {
      const { chatId, content } = payload;

      if (!this.isAuthenticated(client)) {
        WebSocketResponseHelper.emitError(client, 'Authentication required');
        return;
      }

      const { user } = client.data;
      const message = await this.sendMessageAndGetResponse(
        chatId,
        user,
        content,
      );

      WebSocketResponseHelper.emitNewMessage(this.server, chatId, message);

      this.logger.log(
        `Message sent in chat ${chatId} by ${user.userType} ${user.id}`,
      );
    } catch (error) {
      WebSocketResponseHelper.handleError(
        this.logger,
        client,
        error,
        'Send message',
        'Failed to send message',
      );
    }
  }

  // 특정 채팅방에 시스템 메시지 전송 (서비스에서 호출)
  sendSystemMessage(chatId: number, message: string): void {
    WebSocketResponseHelper.emitSystemMessage(this.server, chatId, message);
  }

  // 특정 사용자에게 알림 전송
  sendNotificationToUser(
    userId: number,
    notification: Record<string, unknown>,
  ): void {
    WebSocketResponseHelper.emitNotification(this.server, userId, notification);
  }
}
