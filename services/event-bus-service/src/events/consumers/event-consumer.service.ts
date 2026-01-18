import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../../kafka.service';
import { Topics } from '../topics';

@Injectable()
export class EventConsumerService implements OnModuleInit {
  private readonly logger = new Logger(EventConsumerService.name);

  constructor(private readonly kafka: KafkaService) {}

  async onModuleInit() {
    this.logger.log('Consumer initialized. Subscribing to topics...');

    await this.kafka.subscribeToTopic(Topics.USER_LOGGED_IN, (msg) => {
      this.logger.log(`Received USER_LOGGED_IN → ${JSON.stringify(msg)}`);
    });

    await this.kafka.subscribeToTopic(Topics.BANK_CERTIFICATE_UPLOADED, (msg) => {
      this.logger.log(`Received BANK_CERTIFICATE_UPLOADED → ${JSON.stringify(msg)}`);
    });

    await this.kafka.subscribeToTopic(Topics.SIGNATURE_COMPLETED, (msg) => {
      this.logger.log(`Received SIGNATURE_COMPLETED → ${JSON.stringify(msg)}`);
    });

    await this.kafka.subscribeToTopic(Topics.CONTRACT_GENERATED, (msg) => {
      this.logger.log(`Received CONTRACT_GENERATED → ${JSON.stringify(msg)}`);
    });
  }
}
