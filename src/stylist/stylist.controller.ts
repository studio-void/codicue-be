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
import { StylistService } from './stylist.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserId } from '../user/user.decorator';
import {
  StylistResponseDto,
  ReviewResponseDto,
} from './dto/stylist-response.dto';
import { swaggerConfig } from '../config/swagger.config';

@ApiTags('stylists')
@Controller('stylists')
export class StylistController {
  constructor(private readonly stylistService: StylistService) {}

  @ApiOperation({
    summary: '스타일리스트 목록 조회',
    description: '모든 스타일리스트의 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스타일리스트 목록 반환',
    type: [StylistResponseDto],
  })
  @Get()
  async findAll() {
    return await this.stylistService.findAll();
  }

  @ApiOperation({
    summary: '스타일리스트 상세 조회',
    description: '특정 스타일리스트의 상세 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스타일리스트 정보 반환',
    type: StylistResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 스타일리스트를 찾을 수 없음',
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.stylistService.findById(id);
  }

  @ApiOperation({
    summary: '내 스타일리스트 정보 조회',
    description: '현재 로그인한 스타일리스트의 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스타일리스트 정보 반환',
    type: StylistResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 404,
    description: '스타일리스트를 찾을 수 없음',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@UserId() userId: number) {
    return await this.stylistService.findById(userId);
  }

  @ApiOperation({
    summary: '스타일리스트 등록',
    description: '새로운 스타일리스트를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '스타일리스트 등록 성공',
    type: StylistResponseDto,
  })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  @Post()
  async create(@Body() createStylistDto: CreateStylistDto) {
    return await this.stylistService.create(createStylistDto);
  }

  @ApiOperation({
    summary: '내 스타일리스트 정보 수정',
    description: '현재 로그인한 스타일리스트의 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스타일리스트 정보 수정 성공',
    type: StylistResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 404,
    description: '스타일리스트를 찾을 수 없음',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @UserId() userId: number,
    @Body() updateStylistDto: UpdateStylistDto,
  ) {
    return this.stylistService.update(userId, updateStylistDto);
  }

  @ApiOperation({
    summary: '내 스타일리스트 계정 삭제',
    description: '현재 로그인한 스타일리스트의 계정을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스타일리스트 삭제 성공',
    type: StylistResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 404,
    description: '스타일리스트를 찾을 수 없음',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@UserId() userId: number) {
    return this.stylistService.delete(userId);
  }

  @ApiOperation({
    summary: '스타일리스트 리뷰 조회',
    description: '특정 스타일리스트에 대한 리뷰 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록 반환',
    type: [ReviewResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 스타일리스트를 찾을 수 없음',
  })
  @Get(':id/reviews')
  async getReviews(@Param('id', ParseIntPipe) id: number) {
    return await this.stylistService.getReviews(id);
  }

  @ApiOperation({
    summary: '스타일리스트 리뷰 작성',
    description:
      '특정 스타일리스트에 대한 리뷰를 작성합니다. 리뷰 작성 후 스타일리스트의 평균 별점과 리뷰 개수가 자동으로 업데이트됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '리뷰 작성 성공',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 404,
    description: '해당 ID의 스타일리스트를 찾을 수 없음',
  })
  @ApiBearerAuth(swaggerConfig.BEARER_AUTH_NAME)
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.stylistService.createReview(id, userId, createReviewDto);
  }
}
