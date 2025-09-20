import { ApiProperty } from '@nestjs/swagger';
import { Style } from '@prisma/client';

export class StylistResponseDto {
  @ApiProperty({
    description: '스타일리스트 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '이메일',
    example: 'stylist@example.com',
  })
  email: string;

  @ApiProperty({
    description: '이름',
    example: '김스타일',
  })
  name: string;

  @ApiProperty({
    description: '평균 별점',
    example: 4.5,
  })
  rating: number;

  @ApiProperty({
    description: '리뷰 개수',
    example: 25,
  })
  reviewCount: number;

  @ApiProperty({
    description: '인증 상태',
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: '소개글',
    example: '10년 경력의 전문 스타일리스트입니다.',
    nullable: true,
  })
  introduction: string | null;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  profileImageUrl: string | null;

  @ApiProperty({
    description: '전문 스타일',
    example: ['MINIMAL', 'CLASSIC'],
    enum: Style,
    isArray: true,
  })
  specialtyStyles: Style[];

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

export class ReviewResponseDto {
  @ApiProperty({
    description: '리뷰 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '리뷰 작성자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '스타일리스트 ID',
    example: 1,
  })
  stylistId: number;

  @ApiProperty({
    description: '별점 (1-5)',
    example: 5,
  })
  rating: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '스타일링이 정말 만족스러웠습니다!',
  })
  comment: string;

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
    description: '리뷰 작성자 정보',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: '홍길동' },
    },
  })
  user: {
    id: number;
    name: string;
  };
}
