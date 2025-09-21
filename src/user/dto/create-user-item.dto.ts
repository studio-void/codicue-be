import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BodyType, ItemCategory } from '@prisma/client';

export class CreateUserItemDto {
  @ApiProperty({
    description: '아이템 이름',
    example: '화이트 셔츠',
    type: String,
  })
  @IsString({ message: '아이템 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '아이템 이름을 입력해주세요.' })
  name: string;

  @ApiProperty({
    description: '아이템 카테고리',
    example: 'TOP',
    enum: ItemCategory,
  })
  @IsEnum(ItemCategory, { message: '유효한 카테고리를 선택해주세요.' })
  @IsNotEmpty()
  category: ItemCategory;

  @ApiProperty({
    description: '아이템 이미지 URL',
    example: 'https://example.com/image.jpg',
    type: String,
  })
  @IsUrl({}, { message: '유효한 URL을 입력해주세요.' })
  @IsNotEmpty({ message: '이미지 URL을 입력해주세요.' })
  imageUrl: string;

  @ApiProperty({
    description: '추천 체형 (배열)',
    example: ['RECTANGLE', 'HOURGLASS'],
    enum: BodyType,
    isArray: true,
    required: false,
  })
  @IsArray({ message: '추천 체형은 배열이어야 합니다.' })
  @IsEnum(BodyType, { each: true, message: '유효한 체형을 선택해주세요.' })
  @IsOptional()
  recommendedBodyType?: BodyType[];

  @ApiProperty({
    description: '스타일링 조언',
    example: '깔끔한 비즈니스 룩에 적합합니다.',
    type: String,
  })
  @IsString({ message: '조언은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '조언을 입력해주세요.' })
  advice: string;

  @ApiProperty({
    description: '태그 (배열)',
    example: ['비즈니스', '깔끔', '화이트'],
    type: [String],
    required: false,
  })
  @IsArray({ message: '태그는 배열이어야 합니다.' })
  @IsString({ each: true, message: '태그는 문자열이어야 합니다.' })
  @IsOptional()
  tags?: string[];
}
