import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BodyService } from './body.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserId } from '../user/user.decorator';
import { CreateBodyDto } from './dto/create-body.dto';
import { UpdateBodyDto } from './dto/update-body.dto';
import { BodyResponseDto } from './dto/body-response.dto';

@ApiTags('body')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('body')
export class BodyController {
  constructor(private readonly bodyService: BodyService) {}

  @ApiOperation({
    summary: '체형 정보 조회',
    description: '현재 사용자의 체형 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '체형 정보 반환',
    type: BodyResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '체형 정보를 찾을 수 없음' })
  @Get()
  async getBody(@UserId() userId: number) {
    return await this.bodyService.findByUserId(userId);
  }

  @ApiOperation({
    summary: '체형 정보 등록',
    description: '새로운 체형 정보를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '체형 정보 등록 성공',
    type: BodyResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '이미 체형 정보가 존재함' })
  @Post()
  async createBody(
    @UserId() userId: number,
    @Body() createBodyDto: CreateBodyDto,
  ) {
    return await this.bodyService.create(userId, createBodyDto);
  }

  @ApiOperation({
    summary: '체형 정보 수정',
    description: '현재 사용자의 체형 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '체형 정보 수정 성공',
    type: BodyResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '체형 정보를 찾을 수 없음' })
  @Patch()
  async updateBody(
    @UserId() userId: number,
    @Body() updateBodyDto: UpdateBodyDto,
  ) {
    return await this.bodyService.update(userId, updateBodyDto);
  }

  @ApiOperation({
    summary: '체형 정보 삭제',
    description: '현재 사용자의 체형 정보를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '체형 정보 삭제 성공',
    type: BodyResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '체형 정보를 찾을 수 없음' })
  @Delete()
  async deleteBody(@UserId() userId: number) {
    return await this.bodyService.delete(userId);
  }
}
