import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { PrismaService } from 'prisma/prisma.service';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [MetricsModule],
  controllers: [EmailsController],
  providers: [EmailsService, PrismaService],
})
export class EmailsModule {}
