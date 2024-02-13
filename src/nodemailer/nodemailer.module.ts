import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [NodemailerService, PrismaService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
