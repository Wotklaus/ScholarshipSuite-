import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumer.name);

  async onModuleInit() {
    const kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      clientId: 'analytics-service',
    });

    const consumer = kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || 'analytics-group',
    });

    await consumer.connect();
    this.logger.log('🔥 Kafka consumer connected');

    await consumer.subscribe({ topic: 'contracts.generated' });
    await consumer.subscribe({ topic: 'signatures.completed' });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;

        const payload = JSON.parse(message.value.toString());

        if (topic === 'contracts.generated') {
          await this.analyticsService.cacheContractSummary(
            payload.userId,
            {
              userId: payload.userId,
              contractId: payload.contractId,
              status: payload.status,
              updatedAt: payload.timestamp,
            },
          );
        }

        if (topic === 'signatures.completed') {
          await this.analyticsService.cacheContractSummary(
            payload.userId,
            {
              userId: payload.userId,
              contractId: payload.contractId,
              status: 'signed',
              updatedAt: payload.timestamp,
            },
          );
        }

        this.logger.log(`📥 Event processed → ${topic}`);
      },
    });
  }

  constructor(private readonly analyticsService: AnalyticsService) {}
}
