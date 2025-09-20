import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ChangePointDto {
  @ApiProperty({
    description: '변경할 포인트 양 (양수: 획득, 음수: 사용)',
    example: 100,
    type: Number,
  })
  @IsInt({ message: '포인트는 정수여야 합니다.' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: '포인트 변경 사유',
    example: '스타일링 상담 결제',
    type: String,
  })
  @IsString({ message: '변경 사유는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '변경 사유를 입력해주세요.' })
  reason: string;
}
