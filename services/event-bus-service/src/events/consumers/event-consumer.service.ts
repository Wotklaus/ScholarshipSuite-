import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../../kafka.service';
import { Topics } from '../topics';

// ⬅️ NUEVO
import { RabbitmqPublisher } from '../../rabbitmq/rabbitmq.publisher';

@Injectable()
export class EventConsumerService implements OnModuleInit {
  private readonly logger = new Logger(EventConsumerService.name);

  // ⬅️ RabbitMQ agregado (NO rompe Kafka)
  constructor(
    private readonly kafka: KafkaService,
    private readonly rabbit: RabbitmqPublisher,
  ) { }

  async onModuleInit() {
    this.logger.log('Consumer initialized. Subscribing to topics...');

    // ==============================
    // USER_LOGGED_IN → RabbitMQ
    // ==============================
    await this.kafka.subscribeToTopic(Topics.USER_LOGGED_IN, async (msg) => {
      this.logger.log(`Received USER_LOGGED_IN → ${JSON.stringify(msg)}`);

      await this.rabbit.publish('notifications.user.logged.in', msg);
    });

    // ==============================
    // BANK_CERTIFICATE (solo log)
    // ==============================
    await this.kafka.subscribeToTopic(
      Topics.BANK_CERTIFICATE_UPLOADED,
      async (msg) => {
        this.logger.log(
          `Received BANK_CERTIFICATE_UPLOADED → ${JSON.stringify(msg)}`
        );

        await this.rabbit.publish(
          'notifications.bank_certificate_uploaded',
          {
            userId: msg.userId ?? msg.certificate?.userId,
            certificateId: msg.certificateId ?? msg.certificate?.id,
            timestamp: Date.now(),
          }
        );
      },
    );


    // ==============================
    // SIGNATURE (solo log)
    // ==============================
    await this.kafka.subscribeToTopic(Topics.SIGNATURE_COMPLETED, (msg) => {
      this.logger.log(`Received SIGNATURE_COMPLETED → ${JSON.stringify(msg)}`);
    });

    // ==============================
    // CONTRACT_GENERATED → RabbitMQ
    // ==============================
    await this.kafka.subscribeToTopic(Topics.CONTRACT_GENERATED, async (msg) => {
      this.logger.log(`Received CONTRACT_GENERATED → ${JSON.stringify(msg)}`);

      await this.rabbit.publish('notifications.contract.generated', msg);
    });
  }
}
