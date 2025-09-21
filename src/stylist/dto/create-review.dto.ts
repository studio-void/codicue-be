import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: '별점 (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 최소 1점입니다.' })
  @Max(5, { message: '별점은 최대 5점입니다.' })
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: '리뷰 내용 (선택사항)',
    example: '스타일링이 정말 만족스러웠습니다!',
    type: String,
    required: false,
  })
  @IsString({ message: '리뷰 내용은 문자열이어야 합니다.' })
  @IsOptional()
  comment?: string;
}
