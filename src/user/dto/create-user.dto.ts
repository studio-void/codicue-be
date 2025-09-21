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
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address (must be unique)',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
    maxLength: 32,
    description: 'User password (8~32 characters)',
    type: String,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User real name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

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
    example: ['MINIMAL', 'CASUAL'],
    description: 'Preferred fashion styles',
    enum: Style,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Style, { each: true })
  preferredStyle?: Style[];
}
