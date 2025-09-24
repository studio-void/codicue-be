import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ErrorResponse,
  ConnectionSuccessResponse,
  ChatJoinedResponse,
  ChatLeftResponse,
  NewMessageResponse,
  SystemMessageResponse,
  NotificationResponse,
} from '../types/chat.types';

export class WebSocketResponseHelper {
  private static logger = new Logger(WebSocketResponseHelper.name);

  static emitError(
    client: AuthenticatedSocket,
    message: string,
    code?: string,
  ): void {
    const errorResponse: ErrorResponse = { message, code };
    client.emit('error', errorResponse);
    this.logger.error(`Error sent to client ${client.id}: ${message}`);
  }

  static disconnectWithError(
    client: AuthenticatedSocket,
    message: string,
    code?: string,
  ): void {
    this.emitError(client, message, code);
    client.disconnect();
    this.logger.warn(
      `Client ${client.id} disconnected due to error: ${message}`,
    );
  }

  static emitConnectionSuccess(
    client: AuthenticatedSocket,
    userId: number,
    userType: 'user' | 'stylist',
  ): void {
    const response: ConnectionSuccessResponse = {
      message: 'Connected to chat server',
      userId,
      userType,
    };
    client.emit('connected', response);
    this.logger.log(`Connection success sent to client ${client.id}`);
  }

  static emitChatJoined(client: AuthenticatedSocket, chatId: number): void {
    const response: ChatJoinedResponse = {
      chatId,
      message: 'Successfully joined chat room',
    };
    client.emit('joinedChat', response);
    this.logger.log(
      `Chat joined confirmation sent to client ${client.id} for chat ${chatId}`,
    );
  }

  static emitChatLeft(client: AuthenticatedSocket, chatId: number): void {
    const response: ChatLeftResponse = {
      chatId,
      message: 'Left chat room',
    };
    client.emit('leftChat', response);
    this.logger.log(
      `Chat left confirmation sent to client ${client.id} for chat ${chatId}`,
    );
  }

  static emitNewMessage(
    server: Server,
    chatId: number,
    messageData: NewMessageResponse,
  ): void {
    server.to(`chat-${chatId}`).emit('newMessage', messageData);
    this.logger.log(`New message broadcasted to chat ${chatId}`);
  }

  static emitSystemMessage(
    server: Server,
    chatId: number,
    message: string,
  ): void {
    const response: SystemMessageResponse = {
      chatId,
      message,
      timestamp: new Date(),
    };
    server.to(`chat-${chatId}`).emit('systemMessage', response);
    this.logger.log(`System message sent to chat ${chatId}: ${message}`);
  }

  static emitNotification(
    server: Server,
    userId: number,
    notification: Record<string, unknown>,
  ): void {
    const response: NotificationResponse = {
      userId,
      ...notification,
    };
    server.emit('notification', response);
    this.logger.log(`Notification sent to user ${userId}`);
  }

  static handleError(
    logger: Logger,
    client: AuthenticatedSocket,
    error: any,
    operation: string,
    fallbackMessage: string,
  ): void {
    logger.error(`${operation} error: ${error}`);
    this.emitError(client, fallbackMessage);
  }
}
