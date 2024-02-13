import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Email } from '@prisma/client';

type EmailWithoutId = Omit<Email, 'id'>;

@Injectable()
export class EmailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<EmailWithoutId[]> {
    return this.prismaService.email.findMany({
      select: {
        email: true,
        status: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  async getOne(email: string): Promise<Email | null> {
    return this.prismaService.email.findUnique({
      where: { email },
    });
  }

  async create(email: string): Promise<Email> {
    const existingEmail = await this.getOne(email);

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email) || typeof email !== 'string') {
      throw new BadRequestException('Invalid email format');
    }

    return this.prismaService.email.create({
      data: { email },
    });
  }

  async remove(email: string): Promise<void> {
    const existingEmail = await this.getOne(email);

    if (!existingEmail) {
      throw new NotFoundException('Email not found');
    }

    if (existingEmail.status === 'unsubscribed') {
      throw new ConflictException('Email already deleted');
    }

    await this.prismaService.email.update({
      where: { email },
      data: {
        status: 'unsubscribed',
        deletedAt: new Date(),
      },
    });
  }
}
