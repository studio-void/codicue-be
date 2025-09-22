import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { StylistLoginDto } from './dto/stylist-login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.guard';
import {
  LoginResponseDto,
  LogoutResponseDto,
  StylistLoginResponseDto,
} from './dto/auth-response.dto';
import { swaggerConfig } from '../config/swagger.config';
import { UserTypeGuard } from './guards/user-type.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '사용자 인증 후 JWT 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '비밀번호가 틀렸음' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @HttpCode(200)
  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @ApiOperation({
    summary: '로그아웃',
    description: 'JWT 토큰을 무효화합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @HttpCode(200)
  @Delete('logout')
  logout() {
    return this.authService.logout();
  }

  @ApiOperation({
    summary: '스타일리스트 로그인',
    description: '스타일리스트 인증 후 JWT 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공, JWT 토큰 반환',
    type: StylistLoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '비밀번호가 틀렸음' })
  @ApiResponse({ status: 404, description: '스타일리스트를 찾을 수 없음' })
  @HttpCode(200)
  @Post('stylist/login')
  stylistLogin(@Body() loginData: StylistLoginDto) {
    return this.authService.stylistLogin(loginData);
  }

  @ApiOperation({
    summary: '스타일리스트 로그아웃',
    description: '스타일리스트 JWT 토큰을 무효화합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('stylist'))
  @HttpCode(200)
  @Delete('stylist/logout')
  stylistLogout() {
    return this.authService.logout();
  }
}
