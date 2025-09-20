import { Module } from '@nestjs/common';
import { StylistController } from './stylist.controller';
import { StylistService } from './stylist.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StylistController],
  providers: [StylistService],
  exports: [StylistService],
})
export class StylistModule {}
