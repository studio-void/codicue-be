import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // 사용자의 모든 채팅방 조회
  async getUserChats(userId: number) {
    return await this.prisma.chat.findMany({
      where: { userId },
      include: {
        stylist: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            rating: true,
            isVerified: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // 마지막 메시지만
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // 스타일리스트의 모든 채팅방 조회
  async getStylistChats(stylistId: number) {
    return await this.prisma.chat.findMany({
      where: { stylistId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // 마지막 메시지만
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // 특정 채팅방 조회 (사용자용)
  async getChatByIdForUser(chatId: number, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
      include: {
        stylist: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            rating: true,
            isVerified: true,
          },
        },
        messages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            stylist: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${chatId} not found for this user`,
      );
    }

    return chat;
  }

  // 특정 채팅방 조회 (스타일리스트용)
  async getChatByIdForStylist(chatId: number, stylistId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, stylistId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            stylist: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${chatId} not found for this stylist`,
      );
    }

    return chat;
  }

  // 채팅방 생성 또는 기존 채팅방 반환
  async createOrGetChat(userId: number, stylistId: number) {
    // 기존 채팅방이 있는지 확인
    const existingChat = await this.prisma.chat.findFirst({
      where: { userId, stylistId },
    });

    if (existingChat) {
      return existingChat;
    }

    // 사용자와 스타일리스트 존재 확인
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const stylist = await this.prisma.stylist.findUnique({
      where: { id: stylistId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!stylist) {
      throw new NotFoundException(`Stylist with ID ${stylistId} not found`);
    }

    // 새 채팅방 생성
    return await this.prisma.chat.create({
      data: { userId, stylistId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        stylist: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            rating: true,
            isVerified: true,
          },
        },
      },
    });
  }

  // 메시지 전송 (사용자가)
  async sendMessageFromUser(chatId: number, userId: number, content: string) {
    // 채팅방 권한 확인
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${chatId} not found for this user`,
      );
    }

    return await this.prisma.$transaction(async (prisma) => {
      // 메시지 생성
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId: userId,
          content,
          isFromUser: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 채팅방 업데이트 시간 갱신
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }

  // 메시지 전송 (스타일리스트가)
  async sendMessageFromStylist(
    chatId: number,
    stylistId: number,
    content: string,
  ) {
    // 채팅방 권한 확인
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, stylistId },
    });

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${chatId} not found for this stylist`,
      );
    }

    return await this.prisma.$transaction(async (prisma) => {
      // 메시지 생성
      const message = await prisma.message.create({
        data: {
          chatId,
          stylistId,
          content,
          isFromUser: false,
        },
        include: {
          stylist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 채팅방 업데이트 시간 갱신
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }
}
