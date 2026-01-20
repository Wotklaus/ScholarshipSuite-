import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [AnalyticsModule], // 👈 aquí entra AnalyticsService
  providers: [KafkaConsumer],
})
export class KafkaModule {}
