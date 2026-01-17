import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private readonly logger = new Logger(KafkaService.name);

  async onModuleInit() {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();

    this.logger.log('🚀 Kafka producer connected successfully');
  }

  async emit(topic: string, event: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });

    this.logger.log(`📨 Event sent → topic="${topic}" event=${JSON.stringify(event)}`);
  }
}
