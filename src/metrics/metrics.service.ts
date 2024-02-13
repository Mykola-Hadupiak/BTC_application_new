import { Injectable } from '@nestjs/common';
import { Counter, Gauge } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('email_subscribe_count')
    private subscribeCount: Counter<string>,

    @InjectMetric('email_unsubscribe_count')
    private unsubscribeCount: Counter<string>,

    @InjectMetric('email_send_count')
    private sendCount: Counter<string>,

    @InjectMetric('email_send_error_count')
    private sendErrorCount: Counter<string>,

    @InjectMetric('exchange_rate')
    private exchangeRate: Gauge<string>,
  ) {}

  incrementSubscribeCount(): void {
    this.subscribeCount.inc();
  }

  incrementUnsubscribeCount(): void {
    this.unsubscribeCount.inc();
  }

  incrementSendCount(count: number = 1): void {
    this.sendCount.inc(count);
  }

  incrementSendErrorCount(count: number = 1): void {
    this.sendErrorCount.inc(count);
  }

  setExchangeRate(value: number): void {
    this.exchangeRate.set(value);
  }
}
