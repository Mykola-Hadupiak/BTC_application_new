import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [],
  controllers: [EmailsController],
  providers: [EmailsService, PrismaService],
})
export class EmailsModule {}
