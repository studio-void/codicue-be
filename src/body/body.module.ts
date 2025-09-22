import { Module } from '@nestjs/common';
import { BodyController } from './body.controller';
import { BodyService } from './body.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BodyController],
  providers: [BodyService],
  exports: [BodyService],
})
export class BodyModule {}
