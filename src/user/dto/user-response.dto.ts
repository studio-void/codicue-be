import { ApiProperty } from '@nestjs/swagger';
import { Style } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '보유 포인트',
    example: 1500,
  })
  point: number;

  @ApiProperty({
    description: '선호하는 스타일',
    example: ['MINIMAL', 'CASUAL'],
    enum: Style,
    isArray: true,
  })
  preferredStyle: Style[];

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
}

export class ItemResponseDto {
  @ApiProperty({
    description: '아이템 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '소유자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '아이템 이름',
    example: '화이트 셔츠',
  })
  name: string;

  @ApiProperty({
    description: '카테고리',
    example: 'TOP',
  })
  category: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: '추천 체형',
    example: ['RECTANGLE', 'HOURGLASS'],
    isArray: true,
  })
  recommendedBodyType: string[];

  @ApiProperty({
    description: '스타일링 조언',
    example: '깔끔한 비즈니스 룩에 적합합니다.',
  })
  advice: string;

  @ApiProperty({
    description: '태그',
    example: ['비즈니스', '깔끔', '화이트'],
    isArray: true,
  })
  tags: string[];

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
}

export class PointHistoryResponseDto {
  @ApiProperty({
    description: '포인트 히스토리 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '변경 포인트 (양수: 획득, 음수: 사용)',
    example: -100,
  })
  changeAmount: number;

  @ApiProperty({
    description: '변경 사유',
    example: '스타일링 상담 결제',
  })
  reason: string;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
