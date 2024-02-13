import { Controller, Get, Post } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getRate(): Promise<{ rate: number }> {
    const rate = await this.rateService.getRate(false);

    return { rate };
  }

  @Post()
  async sendRateEmails(): Promise<{
    message: string;
    emails: string[];
    errors: string[];
  }> {
    const [sended, errors] = await this.rateService.sendEmails();

    return {
      message: 'Rate successfully sent to active subscriptions',
      emails: sended,
      errors,
    };
  }
}
