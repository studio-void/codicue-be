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

  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 타임스탬프(ISO8601)',
    example: '2025-09-21T12:34:56.000Z',
  })
  timestamp: string;
}

export class StylistLoginResponseDto {
  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '로그인한 스타일리스트 정보',
    type: 'object',
    properties: {
      id: {
        type: 'number',
        example: 1,
        description: '스타일리스트 ID',
      },
      email: {
        type: 'string',
        example: 'stylist@example.com',
        description: '스타일리스트 이메일',
      },
      name: {
        type: 'string',
        example: '김스타일',
        description: '스타일리스트 이름',
      },
    },
  })
  stylist: {
    id: number;
    email: string;
    name: string;
  };
}
