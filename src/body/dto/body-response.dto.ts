import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '@prisma/client';

export class BodyResponseDto {
  @ApiProperty({
    description: '신체 정보 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '키 (cm)',
    example: 170.5,
  })
  height: number;

  @ApiProperty({
    description: '몸무게 (kg)',
    example: 65.2,
  })
  weight: number;

  @ApiProperty({
    description: '어깨넓이 (cm)',
    example: 40.5,
    nullable: true,
  })
  shoulderWidth: number | null;

  @ApiProperty({
    description: '허리둘레 (cm)',
    example: 75.0,
    nullable: true,
  })
  waistSize: number | null;

  @ApiProperty({
    description: '다리 비율 (%)',
    example: 45.5,
    nullable: true,
  })
  legRatio: number | null;

  @ApiProperty({
    description: '추천 스타일',
    example: '미니멀하고 깔끔한 스타일',
    nullable: true,
  })
  recommendedStyle: string | null;

  @ApiProperty({
    description: '체형 종류',
    example: 'RECTANGLE',
    enum: BodyType,
    nullable: true,
  })
  bodyType: BodyType | null;

  @ApiProperty({
    description: '체형 한줄평',
    example: '균형잡힌 직사각형 체형으로 다양한 스타일에 적합합니다.',
    nullable: true,
  })
  summary: string | null;

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
