import { Kafka } from 'kafkajs';
import { Topics } from './topics';

export class EventBusClient {
  private kafka = new Kafka({
    clientId: 'auth-service',
    brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
  });

  private producer = this.kafka.producer();

  async emitUserLoggedIn(data: any) {
    await this.producer.connect();

    await this.producer.send({
      topic: Topics.USER_LOGGED_IN,
      messages: [{ value: JSON.stringify(data) }],
    });

    await this.producer.disconnect();
  }
}
