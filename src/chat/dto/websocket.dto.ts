import { ApiProperty } from '@nestjs/swagger';

export class JoinChatDto {
  @ApiProperty({
    description: '참여할 채팅방 ID',
    example: 1,
  })
  chatId: number;
}

export class SendMessageDto {
  @ApiProperty({
    description: '메시지를 보낼 채팅방 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요!',
  })
  content: string;
}

export class WebSocketMessageDto {
  @ApiProperty({
    description: '메시지 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요!',
  })
  content: string;

  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    description: '발신자 ID',
    example: 1,
  })
  senderId: number;

  @ApiProperty({
    description: '발신자 타입',
    enum: ['user', 'stylist'],
    example: 'user',
  })
  senderType: 'user' | 'stylist';

  @ApiProperty({
    description: '발신자 이름',
    example: '홍길동',
  })
  senderName: string;

  @ApiProperty({
    description: '생성 시간',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '사용자가 보낸 메시지인지 여부',
    example: true,
  })
  isFromUser: boolean;
}
