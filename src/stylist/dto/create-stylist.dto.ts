import { ApiProperty } from '@nestjs/swagger';
import { Style } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreateStylistDto {
  @ApiProperty({
    example: 'stylist@example.com',
    description: 'Stylist email address (must be unique)',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
    maxLength: 32,
    description: 'Stylist password (8~32 characters)',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({
    example: 'Jane Smith',
    description: 'Stylist real name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: ['MINIMAL', 'CLASSIC'],
    description: 'Specialty fashion styles',
    enum: Style,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Style, { each: true })
  specialtyStyles?: Style[];

  @ApiProperty({
    example: [
      '서울대학교 의류학과 졸업',
      'Vogue Korea 인턴 스타일리스트',
      '현대백화점 VIP 스타일리스트 3년',
    ],
    description: 'Career history',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  career?: string[];

  @ApiProperty({
    example: 'Professional fashion stylist with 5 years of experience.',
    description: 'Stylist introduction',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
