import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: 'email_subscribe_count',
      help: 'Counts the number of email subscriptions',
    }),
    makeCounterProvider({
      name: 'email_unsubscribe_count',
      help: 'Counts the number of email unsubscriptions',
    }),
    makeCounterProvider({
      name: 'email_send_count',
      help: 'Counts the number of emails sent',
    }),
    makeCounterProvider({
      name: 'email_send_error_count',
      help: 'Counts the number of email sending errors',
    }),
    makeGaugeProvider({
      name: 'exchange_rate',
      help: 'Tracks the exchange rate',
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
