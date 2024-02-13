import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { PrismaService } from 'prisma/prisma.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { RateController } from './rate.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [NodemailerModule, ScheduleModule.forRoot()],
  controllers: [RateController],
  providers: [RateService, PrismaService],
})
export class RateModule {}
