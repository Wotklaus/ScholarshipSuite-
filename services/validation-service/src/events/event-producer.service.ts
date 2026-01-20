import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class EventProducerService implements OnModuleInit {
  private readonly logger = new Logger(EventProducerService.name);

  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'validation-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka producer connected (validation-service)');
  }

  async emit(topic: string, event: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });

    this.logger.log(`📤 Event emitted → ${topic}`);
  }
}
