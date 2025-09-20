import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요! 스타일링 상담을 받고 싶습니다.',
    type: String,
  })
  @IsString({ message: '메시지 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '메시지 내용을 입력해주세요.' })
  @MaxLength(1000, { message: '메시지는 1000자 이하로 입력해주세요.' })
  content: string;
}
