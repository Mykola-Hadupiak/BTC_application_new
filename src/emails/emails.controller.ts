import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { MetricsService } from 'src/metrics/metrics.service';

@Controller('emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  async getAll() {
    return this.emailsService.getAll();
  }

  @Post()
  async create(@Body() body: { email: string }): Promise<{ message: string }> {
    const { email } = body;

    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email is required and should be a string');
    }

    await this.emailsService.create(email);
    this.metricsService.incrementSubscribeCount();

    return { message: 'E-mail added' };
  }

  @Delete()
  async remove(@Body() body: { email: string }): Promise<{ message: string }> {
    const { email } = body;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    await this.emailsService.remove(email);

    this.metricsService.incrementUnsubscribeCount();

    return { message: 'E-mail deleted' };
  }
}
