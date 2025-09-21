import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum BodyType {
  INVERTED_TRIANGLE = 'INVERTED_TRIANGLE',
  TRIANGLE = 'TRIANGLE',
  RECTANGLE = 'RECTANGLE',
  APPLE = 'APPLE',
  PEAR = 'PEAR',
  HOURGLASS = 'HOURGLASS',
}

export class CreateBodyDto {
  @ApiProperty({
    example: 170.5,
    description: 'Height in centimeters',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty({
    example: 65.2,
    description: 'Weight in kilograms',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({
    example: 40.5,
    description: 'Shoulder width in centimeters',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shoulderWidth?: number;

  @ApiProperty({
    example: 68.0,
    description: 'Waist size in centimeters',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  waistSize?: number;

  @ApiProperty({
    example: 45.5,
    description: 'Leg ratio in percentage',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  legRatio?: number;

  @ApiProperty({
    example: 'Casual and comfortable style suits you best',
    description: 'Recommended style description',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  recommendedStyle?: string;

  @ApiProperty({
    example: 'RECTANGLE',
    description: 'Body type classification',
    enum: BodyType,
    required: false,
  })
  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @ApiProperty({
    example: 'Well-balanced proportions with athletic build',
    description: 'Body analysis summary',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;
}
