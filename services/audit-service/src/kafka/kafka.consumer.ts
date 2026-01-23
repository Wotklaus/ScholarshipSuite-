import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class KafkaAuditConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaAuditConsumer.name);

  private kafka = new Kafka({
    clientId: 'audit-service',
    brokers: ['localhost:9092'],
  });

  private consumer = this.kafka.consumer({
    groupId: 'audit-group',
  });

  constructor(private readonly auditService: AuditService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'auth.user_logged_in',
      fromBeginning: true,
    });

    this.logger.log('👂 Listening to auth.user_logged_in');

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());

        this.logger.log(`📥 USER_LOGGED_IN received → ${event.userId}`);
         
        
        await this.auditService.saveEvent({
          eventType: 'USER_LOGGED_IN',
          source: 'auth-service',
          aggregate: 'user',
          aggregateId: event.userId,
          payload: event,
          timestamp: Date.now(),
        });
      },
    });
  }
}
