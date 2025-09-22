import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Body } from '@prisma/client';
import { CreateBodyDto } from './dto/create-body.dto';
import { UpdateBodyDto } from './dto/update-body.dto';

export type BodySelect = Partial<Record<keyof Body, true>>;

@Injectable()
export class BodyService {
  constructor(private prisma: PrismaService) {}

  private getBasicBodySelect(): BodySelect {
    return {
      id: true,
      userId: true,
      height: true,
      weight: true,
      shoulderWidth: true,
      waistSize: true,
      legRatio: true,
      recommendedStyle: true,
      bodyType: true,
      summary: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async create(userId: number, createBodyDto: CreateBodyDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if body data already exists for this user
    const existingBody = await this.prisma.body.findUnique({
      where: { userId },
    });

    if (existingBody) {
      throw new ConflictException('Body data already exists for this user');
    }

    return await this.prisma.body.create({
      data: {
        ...createBodyDto,
        userId,
      },
      select: this.getBasicBodySelect(),
    });
  }

  async findByUserId(userId: number) {
    const body = await this.prisma.body.findUnique({
      where: { userId },
      select: this.getBasicBodySelect(),
    });

    if (!body) {
      throw new NotFoundException(`Body data for user ${userId} not found`);
    }

    return body;
  }

  async update(userId: number, updateBodyDto: UpdateBodyDto) {
    const existingBody = await this.prisma.body.findUnique({
      where: { userId },
    });

    if (!existingBody) {
      throw new NotFoundException(`Body data for user ${userId} not found`);
    }

    return await this.prisma.body.update({
      where: { userId },
      data: updateBodyDto,
      select: this.getBasicBodySelect(),
    });
  }

  async delete(userId: number) {
    const existingBody = await this.prisma.body.findUnique({
      where: { userId },
    });

    if (!existingBody) {
      throw new NotFoundException(`Body data for user ${userId} not found`);
    }

    return await this.prisma.body.delete({
      where: { userId },
      select: this.getBasicBodySelect(),
    });
  }
}
