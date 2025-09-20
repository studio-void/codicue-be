import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserId } from '../user/user.decorator';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ChatListResponseDto,
  ChatResponseDto,
  MessageResponseDto,
} from './dto/chat-response.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 사용자용 API들
  @ApiOperation({
    summary: '사용자 채팅방 목록 조회',
    description: '현재 사용자의 모든 채팅방 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록 반환',
    type: [ChatListResponseDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('user/chats')
  async getUserChats(@UserId() userId: number) {
    return await this.chatService.getUserChats(userId);
  }

  @ApiOperation({
    summary: '사용자 채팅방 상세 조회',
    description: '특정 채팅방의 모든 메시지를 포함한 상세 정보를 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '채팅방 정보 반환', type: ChatResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('user/chats/:id')
  async getChatByIdForUser(
    @Param('id', ParseIntPipe) chatId: number,
    @UserId() userId: number,
  ) {
    return await this.chatService.getChatByIdForUser(chatId, userId);
  }

  @ApiOperation({
    summary: '채팅방 생성',
    description:
      '스타일리스트와의 새로운 채팅방을 생성하거나 기존 채팅방을 반환합니다.',
  })
  @ApiResponse({ status: 201, description: '채팅방 생성 성공', type: ChatResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '스타일리스트를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('user/chats')
  async createChat(
    @UserId() userId: number,
    @Body() createChatDto: CreateChatDto,
  ) {
    return await this.chatService.createOrGetChat(
      userId,
      createChatDto.stylistId,
    );
  }

  @ApiOperation({
    summary: '사용자 메시지 전송',
    description: '채팅방에 사용자 메시지를 전송합니다.',
  })
  @ApiResponse({ status: 201, description: '메시지 전송 성공', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('user/chats/:id/messages')
  async sendMessageFromUser(
    @Param('id', ParseIntPipe) chatId: number,
    @UserId() userId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.chatService.sendMessageFromUser(
      chatId,
      userId,
      createMessageDto.content,
    );
  }

  // 스타일리스트용 API들
  @ApiOperation({
    summary: '스타일리스트 채팅방 목록 조회',
    description: '현재 스타일리스트의 모든 채팅방 목록을 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '채팅방 목록 반환', type: [ChatListResponseDto] })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('stylist/chats')
  async getStylistChats(@UserId() stylistId: number) {
    return await this.chatService.getStylistChats(stylistId);
  }

  @ApiOperation({
    summary: '스타일리스트 채팅방 상세 조회',
    description: '특정 채팅방의 모든 메시지를 포함한 상세 정보를 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '채팅방 정보 반환', type: ChatResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('stylist/chats/:id')
  async getChatByIdForStylist(
    @Param('id', ParseIntPipe) chatId: number,
    @UserId() stylistId: number,
  ) {
    return await this.chatService.getChatByIdForStylist(chatId, stylistId);
  }

  @ApiOperation({
    summary: '스타일리스트 메시지 전송',
    description: '채팅방에 스타일리스트 메시지를 전송합니다.',
  })
  @ApiResponse({ status: 201, description: '메시지 전송 성공', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('stylist/chats/:id/messages')
  async sendMessageFromStylist(
    @Param('id', ParseIntPipe) chatId: number,
    @UserId() stylistId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.chatService.sendMessageFromStylist(
      chatId,
      stylistId,
      createMessageDto.content,
    );
  }
}
