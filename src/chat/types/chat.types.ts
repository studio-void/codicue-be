import { Socket } from 'socket.io';

// User types
export type UserType = 'user' | 'stylist';

export interface AuthenticatedUser {
  id: number;
  userType: UserType;
  email: string;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: AuthenticatedUser;
  };
}

// WebSocket payload types
export interface JoinChatPayload {
  chatId: number;
}

export interface SendMessagePayload {
  chatId: number;
  content: string;
}

// Message types
export interface BaseMessage {
  id: number;
  chatId: number;
  content: string;
  createdAt: Date;
  isFromUser: boolean;
}

export interface MessageFromUser extends BaseMessage {
  senderId: number;
  stylistId: null;
  user: {
    id: number;
    name: string;
  };
}

export interface MessageFromStylist extends BaseMessage {
  senderId: null;
  stylistId: number;
  stylist: {
    id: number;
    name: string;
  };
}

export type ChatMessage = MessageFromUser | MessageFromStylist;

// WebSocket response types
export interface ConnectionSuccessResponse {
  message: string;
  userId: number;
  userType: UserType;
}

export interface ChatJoinedResponse {
  chatId: number;
  message: string;
}

export interface ChatLeftResponse {
  chatId: number;
  message: string;
}

export interface NewMessageResponse {
  id: number;
  content: string;
  chatId: number;
  senderId: number | null;
  senderType: UserType;
  senderName: string;
  createdAt: Date;
  isFromUser: boolean;
}

export interface SystemMessageResponse {
  chatId: number;
  message: string;
  timestamp: Date;
}

export interface NotificationResponse {
  userId: number;
  [key: string]: unknown;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}

// Authentication result types
export interface AuthenticationResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}
