import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: '상담할 스타일리스트 ID',
    example: 1,
    type: Number,
  })
  @IsInt({ message: '스타일리스트 ID는 정수여야 합니다.' })
  @IsPositive({ message: '스타일리스트 ID는 양수여야 합니다.' })
  @IsNotEmpty()
  stylistId: number;
}
