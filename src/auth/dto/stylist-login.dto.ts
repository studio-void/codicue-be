import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class StylistLoginDto {
  @ApiProperty({
    description: '스타일리스트 이메일',
    example: 'stylist@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '스타일리스트 비밀번호',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
