import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import axios from 'axios';
import { Rate } from '@prisma/client';
import { BTC_API } from './common/constants';
import { PinoLogger } from 'nestjs-pino';
import { MetricsService } from 'src/metrics/metrics.service';

interface BTCResponse {
  data: {
    asks: [string, string][];
    bids: [string, string][];
  };
}

@Injectable()
export class RateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly nodemailerService: NodemailerService,
    private readonly logger: PinoLogger,
    private readonly metricsService: MetricsService,
  ) {}

  private async getLatestRate(): Promise<Rate> {
    try {
      const latestRate = await this.prismaService.rate.findFirstOrThrow({
        orderBy: { updatedAt: 'desc' },
      });

      return latestRate;
    } catch (error) {
      throw new BadRequestException(
        'First you need to send emails to someone to start comparing',
      );
    }
  }

  async getRate(saveToDb: boolean): Promise<number> {
    try {
      const response = await axios.get<BTCResponse>(BTC_API);
      const currentRate = parseFloat(response.data.data.asks[0][0]);

      if (isNaN(currentRate)) {
        throw new HttpException('Rate is not valid', HttpStatus.NOT_FOUND);
      }

      if (saveToDb) {
        await this.prismaService.rate.create({ data: { value: currentRate } });
      }

      return currentRate;
    } catch (error) {
      throw new HttpException(
        'Something went wrong with API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendEmails(): Promise<[string[], string[]]> {
    const subscribedEmails = await this.prismaService.email.findMany({
      where: { status: 'subscribed' },
    });

    if (!subscribedEmails.length) {
      throw new HttpException(
        'There are no subscribed emails',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentRate = await this.getRate(true);

    const [sended, errors] =
      await this.nodemailerService.sendEmailToSubscribedUsers(
        currentRate,
        subscribedEmails,
      );

    this.metricsService.incrementSendCount(sended.length);
    this.metricsService.incrementSendErrorCount(errors.length);
    this.metricsService.setExchangeRate(currentRate);

    return [sended, errors];
  }

  private async sendEmailsHourly(
    currentRate: number,
    lastRate: Rate,
  ): Promise<[string[], string[]]> {
    const subscribedEmails = await this.prismaService.email.findMany({
      where: { status: 'subscribed' },
    });

    if (!subscribedEmails.length) {
      throw new HttpException(
        'There are no subscribed emails',
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailsToSend = subscribedEmails.filter(
      ({ createdAt }) => createdAt <= lastRate.updatedAt,
    );

    const [sended, errors] =
      await this.nodemailerService.sendEmailToSubscribedUsers(
        currentRate,
        emailsToSend,
      );

    this.metricsService.incrementSendCount(sended.length);
    this.metricsService.incrementSendErrorCount(errors.length);
    this.metricsService.setExchangeRate(currentRate);

    return [sended, errors];
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyEmails(): Promise<void> {
    const [sended, errors] = await this.sendEmails();

    this.logger.info({
      message:
        'Rate successfully sent to active subscriptions at 9:00 AM Kyiv time',
      emails: sended,
      errors,
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkRateChange(): Promise<void> {
    const lastRate = await this.getLatestRate();

    if (!lastRate) {
      throw new NotFoundException('No rate found');
    }

    const currentRate = await this.getRate(false);

    if (Math.abs(currentRate - lastRate.value) > lastRate.value * 0.05) {
      await this.prismaService.rate.create({ data: { value: currentRate } });

      const [sended, errors] = await this.sendEmailsHourly(
        currentRate,
        lastRate,
      );

      this.logger.info({
        message:
          'Rate successfully sent to active subscriptions (rate changed more than 5%)',
        emails: sended,
        errors,
      });
    }
  }
}
