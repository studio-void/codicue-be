import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export enum Style {
  MINIMAL = 'MINIMAL',
  EFFORTLESS = 'EFFORTLESS',
  STREET = 'STREET',
  HIPHOP = 'HIPHOP',
  CLASSIC = 'CLASSIC',
  ROMANTIC = 'ROMANTIC',
  CASUAL = 'CASUAL',
  FORMAL = 'FORMAL',
  VINTAGE = 'VINTAGE',
  BOHEMIAN = 'BOHEMIAN',
}

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
  @IsIn(Object.values(Style), { each: true })
  specialtyStyles?: Style[];

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
