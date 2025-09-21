import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserId } from './user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePointDto } from './dto/change-point.dto';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';
import {
  UserResponseDto,
  ItemResponseDto,
  PointHistoryResponseDto,
} from './dto/user-response.dto';
import { swaggerConfig } from '../config/swagger.config';
import { UserTypeGuard } from '../auth/guards/user-type.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '현재 사용자 정보 조회',
    description: '인증된 사용자의 정보를 반환합니다.',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @ApiResponse({
    status: 200,
    description: '사용자 정보 반환',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Get()
  async me(@UserId() userId: number) {
    return await this.userService.findById(userId);
  }

  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @ApiOperation({
    summary: '사용자 정보 업데이트',
    description: 'ID에 해당하는 사용자의 정보를 업데이트합니다.',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @ApiResponse({
    status: 200,
    description: '업데이트된 사용자 정보 반환',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 입력 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Patch()
  async update(@UserId() userId: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(userId, updateUserDto);
  }

  @ApiOperation({
    summary: '사용자 탈퇴',
    description: '현재 사용자의 계정을 삭제합니다.',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @ApiResponse({
    status: 200,
    description: '탈퇴 완료',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Delete()
  async remove(@UserId() userId: number) {
    return await this.userService.delete(userId);
  }

  @ApiOperation({
    summary: '포인트 히스토리 조회',
    description: '현재 사용자의 포인트 변경 이력을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '포인트 히스토리 반환',
    type: [PointHistoryResponseDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Get('points')
  async getPointHistory(@UserId() userId: number) {
    return await this.userService.getPointHistory(userId);
  }

  @ApiOperation({
    summary: '포인트 변경',
    description:
      '사용자의 포인트를 변경합니다. 양수면 획득, 음수면 사용입니다. 포인트 히스토리에 자동으로 기록됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '포인트 변경 성공',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: '포인트 부족 (사용 시)' })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Post('points')
  async changePoints(
    @UserId() userId: number,
    @Body() changePointDto: ChangePointDto,
  ) {
    return await this.userService.changePoints(userId, changePointDto);
  }

  // 아이템 관련 엔드포인트들
  @ApiOperation({
    summary: '사용자 아이템 목록 조회',
    description: '현재 사용자가 소유한 모든 아이템 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템 목록 반환',
    type: [ItemResponseDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Get('items')
  async getUserItems(@UserId() userId: number) {
    return await this.userService.getUserItems(userId);
  }

  @ApiOperation({
    summary: '사용자 아이템 상세 조회',
    description: '특정 아이템의 상세 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템 정보 반환',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '아이템을 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Get('items/:id')
  async getUserItemById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return await this.userService.getUserItemById(userId, itemId);
  }

  @ApiOperation({
    summary: '사용자 아이템 생성',
    description: '새로운 아이템을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '아이템 생성 성공',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Post('items')
  async createUserItem(
    @UserId() userId: number,
    @Body() createUserItemDto: CreateUserItemDto,
  ) {
    return await this.userService.createUserItem(userId, createUserItemDto);
  }

  @ApiOperation({
    summary: '사용자 아이템 수정',
    description: '특정 아이템의 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템 수정 성공',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '아이템을 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Patch('items/:id')
  async updateUserItem(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Body() updateUserItemDto: UpdateUserItemDto,
  ) {
    return await this.userService.updateUserItem(
      userId,
      itemId,
      updateUserItemDto,
    );
  }

  @ApiOperation({
    summary: '사용자 아이템 삭제',
    description: '특정 아이템을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '아이템 삭제 성공',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '아이템을 찾을 수 없음' })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard, UserTypeGuard('user'))
  @Delete('items/:id')
  async deleteUserItem(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return await this.userService.deleteUserItem(userId, itemId);
  }
}
