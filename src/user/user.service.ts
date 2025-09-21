import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import userConfig from './user.config';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePointDto } from './dto/change-point.dto';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';

export type UserSelect = Partial<Record<keyof User, true>>;

@Injectable()
export class UserService {
  constructor(
    @Inject(userConfig.KEY) private config: ConfigType<typeof userConfig>,
    private prisma: PrismaService,
  ) {}

  // 민감한 정보를 포함한 필드 선택 (관리자용)
  private getAdminUserSelect(): UserSelect {
    return {
      id: true,
      email: true,
      name: true,
      point: true,
      preferredStyle: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  // 민감한 정보를 제외한 기본 필드 선택 (일반 사용자용)
  private getBasicUserSelect(): UserSelect {
    return {
      id: true,
      email: true,
      name: true,
      point: true,
      preferredStyle: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async create(user: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      user.password,
      parseInt(this.config.auth.passwordSaltRounds, 10),
    );

    // Extract body data from user DTO
    const { height, weight, preferredStyle, ...userData } = user;

    // Create user and body data in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create user
      const createdUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          preferredStyle: preferredStyle || [],
        },
        select: this.getBasicUserSelect(),
      });

      // Create body data
      await prisma.body.create({
        data: {
          userId: createdUser.id,
          height,
          weight,
        },
      });

      return createdUser;
    });

    return result;
  }

  async read() {
    return await this.prisma.user.findMany({
      select: this.getBasicUserSelect(),
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.getBasicUserSelect(),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async readByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, newUser: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const data: UpdateUserDto = { ...newUser };
    if (newUser.password) {
      const rawRounds = Number(this.config.auth.passwordSaltRounds);
      const rounds = Number.isFinite(rawRounds) ? rawRounds : 10;
      const saltRounds = Math.min(Math.max(rounds, 4), 15);
      data.password = await bcrypt.hash(newUser.password, saltRounds);
    }

    return await this.prisma.user.update({
      where: { id },
      data,
      select: this.getBasicUserSelect(),
    });
  }

  async delete(id: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.prisma.user.delete({
      where: { id },
      select: this.getBasicUserSelect(),
    });
  }

  async getPointHistory(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.prisma.pointHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async changePoints(userId: number, changePointDto: ChangePointDto) {
    const { amount, reason } = changePointDto;

    // 트랜잭션으로 포인트 변경 처리
    return await this.prisma.$transaction(async (prisma) => {
      // 현재 사용자의 포인트 확인
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, point: true },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // 포인트 사용인 경우 (음수) 부족 체크
      if (amount < 0 && user.point < Math.abs(amount)) {
        throw new BadRequestException(
          `Insufficient points. Current: ${user.point}, Required: ${Math.abs(amount)}`,
        );
      }

      // 사용자 포인트 업데이트
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { point: user.point + amount },
        select: this.getBasicUserSelect(),
      });

      // 포인트 히스토리 추가
      await prisma.pointHistory.create({
        data: {
          userId,
          changeAmount: amount,
          reason,
        },
      });

      return updatedUser;
    });
  }

  // 아이템 관련 메서드들
  async getUserItems(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserItemById(userId: number, itemId: number) {
    const item = await this.prisma.item.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found for this user`,
      );
    }

    return item;
  }

  async createUserItem(userId: number, createUserItemDto: CreateUserItemDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.prisma.item.create({
      data: {
        ...createUserItemDto,
        userId,
        recommendedBodyType: createUserItemDto.recommendedBodyType || [],
        tags: createUserItemDto.tags || [],
      },
    });
  }

  async updateUserItem(
    userId: number,
    itemId: number,
    updateUserItemDto: UpdateUserItemDto,
  ) {
    const item = await this.prisma.item.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found for this user`,
      );
    }

    return await this.prisma.item.update({
      where: { id: itemId },
      data: updateUserItemDto,
    });
  }

  async deleteUserItem(userId: number, itemId: number) {
    const item = await this.prisma.item.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found for this user`,
      );
    }

    return await this.prisma.item.delete({
      where: { id: itemId },
    });
  }
}
