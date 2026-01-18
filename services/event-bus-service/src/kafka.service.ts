import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  private pendingSubscriptions: string[] = [];
  private callbacks: Record<string, (msg: any) => void> = {};

  constructor() {
    this.kafka = new Kafka({
      clientId: 'event-bus',
      brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'event-bus-group' });
  }

  async onModuleInit() {
    this.logger.log("🔥 Connecting Kafka producer and consumer...");

    await this.producer.connect();
    await this.consumer.connect();

    // 1️⃣ Suscribir todos los topics pendientes ANTES de correr
    for (const topic of this.pendingSubscriptions) {
      await this.consumer.subscribe({ topic });
      this.logger.log(`📥 Subscribed to topic: ${topic}`);
    }

    // 2️⃣ Ahora sí, correr el consumer.run() UNA SOLA VEZ
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const raw = message.value?.toString() ?? '{}';
        const data = JSON.parse(raw);

        const cb = this.callbacks[topic];
        if (cb) cb(data);
      },
    });

    this.logger.log("✅ Kafka ready and consumer running.");
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    this.logger.log(`📤 Event emitted to ${topic}`);
  }

  async subscribeToTopic(topic: string, callback: (msg: any) => void) {
    // Guardar callback
    this.callbacks[topic] = callback;

    // Como el consumer aún NO está corriendo, guardamos el topic para suscribirlo después
    this.pendingSubscriptions.push(topic);
  }
}
