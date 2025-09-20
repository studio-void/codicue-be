import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: '메시지 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    description: '보낸 사람 ID (사용자일 경우)',
    example: 1,
    nullable: true,
  })
  senderId: number | null;

  @ApiProperty({
    description: '보낸 사람 ID (스타일리스트일 경우)',
    example: 1,
    nullable: true,
  })
  stylistId: number | null;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요! 스타일링 상담을 받고 싶습니다.',
  })
  content: string;

  @ApiProperty({
    description: '사용자가 보낸 메시지 여부',
    example: true,
  })
  isFromUser: boolean;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '사용자 정보 (메시지를 보낸 사용자)',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '홍길동' },
    },
    nullable: true,
  })
  user?: {
    id: number;
    name: string;
  };

  @ApiProperty({
    description: '스타일리스트 정보 (메시지를 보낸 스타일리스트)',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '김스타일' },
    },
    nullable: true,
  })
  stylist?: {
    id: number;
    name: string;
  };
}

export class ChatResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '스타일리스트 ID',
    example: 1,
  })
  stylistId: number;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '사용자 정보',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '홍길동' },
    },
    nullable: true,
  })
  user?: {
    id: number;
    name: string;
  };

  @ApiProperty({
    description: '스타일리스트 정보',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '김스타일' },
      profileImageUrl: {
        type: 'string',
        example: 'https://example.com/profile.jpg',
        nullable: true,
      },
      rating: { type: 'number', example: 4.5 },
      isVerified: { type: 'boolean', example: true },
    },
    nullable: true,
  })
  stylist?: {
    id: number;
    name: string;
    profileImageUrl: string | null;
    rating: number;
    isVerified: boolean;
  };

  @ApiProperty({
    description: '메시지 목록',
    type: [MessageResponseDto],
    nullable: true,
  })
  messages?: MessageResponseDto[];
}

export class ChatListResponseDto {
  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '스타일리스트 ID',
    example: 1,
  })
  stylistId: number;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '사용자 정보',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '홍길동' },
    },
    nullable: true,
  })
  user?: {
    id: number;
    name: string;
  };

  @ApiProperty({
    description: '스타일리스트 정보',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '김스타일' },
      profileImageUrl: {
        type: 'string',
        example: 'https://example.com/profile.jpg',
        nullable: true,
      },
      rating: { type: 'number', example: 4.5 },
      isVerified: { type: 'boolean', example: true },
    },
    nullable: true,
  })
  stylist?: {
    id: number;
    name: string;
    profileImageUrl: string | null;
    rating: number;
    isVerified: boolean;
  };

  @ApiProperty({
    description: '마지막 메시지 (최근 1개)',
    type: [MessageResponseDto],
  })
  messages: MessageResponseDto[];
}
