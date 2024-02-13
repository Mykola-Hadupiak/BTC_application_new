import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';
import { PrismaService } from 'prisma/prisma.service';
import { RateModule } from './rate/rate.module';
import { LoggerModule } from 'nestjs-pino';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [EmailsModule, RateModule, LoggerModule.forRoot(), MetricsModule],
  providers: [PrismaService],
})
export class AppModule {}
