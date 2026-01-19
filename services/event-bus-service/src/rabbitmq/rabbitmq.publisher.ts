import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitmqPublisher {
  private readonly logger = new Logger(RabbitmqPublisher.name);

  constructor(private readonly amqp: AmqpConnection) {}

  async publish(routingKey: string, payload: any) {
    await this.amqp.publish('notifications', routingKey, payload);
    this.logger.log(`📤 [EventBus → RMQ] Sent event "${routingKey}"`);
  }
}

