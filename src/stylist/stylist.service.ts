import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stylist } from '@prisma/client';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import * as bcrypt from 'bcrypt';

export type StylistSelect = Partial<Record<keyof Stylist, true>>;

@Injectable()
export class StylistService {
  constructor(private prisma: PrismaService) {}

  // 민감한 정보를 제외한 기본 필드 선택
  private getBasicStylistSelect(): StylistSelect {
    return {
      id: true,
      name: true,
      rating: true,
      reviewCount: true,
      isVerified: true,
      introduction: true,
      profileImageUrl: true,
      specialtyStyles: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async create(stylist: CreateStylistDto) {
    const existingStylist = await this.prisma.stylist.findUnique({
      where: { email: stylist.email },
    });

    if (existingStylist) {
      throw new ConflictException('Stylist with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(stylist.password, 10);

    return await this.prisma.stylist.create({
      data: { ...stylist, password: hashedPassword },
      select: this.getBasicStylistSelect(),
    });
  }

  async findAll() {
    return await this.prisma.stylist.findMany({
      select: this.getBasicStylistSelect(),
    });
  }

  async findById(id: number) {
    const stylist = await this.prisma.stylist.findUnique({
      where: { id },
      select: this.getBasicStylistSelect(),
    });

    if (!stylist) {
      throw new NotFoundException(`Stylist with ID ${id} not found`);
    }

    return stylist;
  }

  async findByEmail(email: string) {
    const stylist = await this.prisma.stylist.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, name: true },
    });

    if (!stylist) {
      throw new NotFoundException(`Stylist with email ${email} not found`);
    }

    return stylist;
  }

  async update(userId: number, updateStylistDto: UpdateStylistDto) {
    const existingStylist = await this.prisma.stylist.findUnique({
      where: { id: userId },
    });

    if (!existingStylist) {
      throw new NotFoundException(`Stylist with ID ${userId} not found`);
    }

    const data: UpdateStylistDto = { ...updateStylistDto };
    if (updateStylistDto.password) {
      data.password = await bcrypt.hash(updateStylistDto.password, 10);
    }

    return await this.prisma.stylist.update({
      where: { id: userId },
      data,
      select: this.getBasicStylistSelect(),
    });
  }

  async delete(userId: number) {
    const existingStylist = await this.prisma.stylist.findUnique({
      where: { id: userId },
    });

    if (!existingStylist) {
      throw new NotFoundException(`Stylist with ID ${userId} not found`);
    }

    return await this.prisma.stylist.delete({
      where: { id: userId },
      select: this.getBasicStylistSelect(),
    });
  }

  async getReviews(id: number) {
    const stylist = await this.prisma.stylist.findUnique({
      where: { id },
    });

    if (!stylist) {
      throw new NotFoundException(`Stylist with ID ${id} not found`);
    }

    return await this.prisma.review.findMany({
      where: { stylistId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(
    stylistId: number,
    userId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const { rating, comment } = createReviewDto;

    // 트랜잭션으로 리뷰 생성 및 스타일리스트 통계 업데이트
    return await this.prisma.$transaction(async (prisma) => {
      // 스타일리스트 존재 확인
      const stylist = await prisma.stylist.findUnique({
        where: { id: stylistId },
      });

      if (!stylist) {
        throw new NotFoundException(`Stylist with ID ${stylistId} not found`);
      }

      // 리뷰 생성
      const newReview = await prisma.review.create({
        data: {
          userId,
          stylistId,
          rating,
          comment: comment || '', // comment가 없으면 빈 문자열
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 해당 스타일리스트의 모든 리뷰 통계 계산
      const reviews = await prisma.review.findMany({
        where: { stylistId },
        select: { rating: true },
      });

      const totalReviews = reviews.length;
      const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

      // 스타일리스트 평점 및 리뷰 개수 업데이트
      await prisma.stylist.update({
        where: { id: stylistId },
        data: {
          rating: Math.round(averageRating * 10) / 10, // 소수점 1자리로 반올림
          reviewCount: totalReviews,
        },
      });

      return newReview;
    });
  }
}
