import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';
import { PrismaService } from 'prisma/prisma.service';
import { RateModule } from './rate/rate.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [EmailsModule, RateModule, LoggerModule.forRoot()],
  providers: [PrismaService],
})
export class AppModule {}
