import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { PrismaService } from 'prisma/prisma.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { RateController } from './rate.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [NodemailerModule, ScheduleModule.forRoot(), MetricsModule],
  controllers: [RateController],
  providers: [RateService, PrismaService],
})
export class RateModule {}
