import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '로그인한 사용자 정보',
    type: 'object',
    properties: {
      id: {
        type: 'number',
        example: 1,
        description: '사용자 ID',
      },
      email: {
        type: 'string',
        example: 'user@example.com',
        description: '사용자 이메일',
      },
      name: {
        type: 'string',
        example: '홍길동',
        description: '사용자 이름',
      },
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export class LogoutResponseDto {
  @ApiProperty({
    description: '로그아웃 성공 메시지',
    example: '로그아웃이 완료되었습니다',
  })
  message: string;
}
