import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqPublisher } from './rabbitmq.publisher';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'notifications',
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [RabbitmqPublisher],
  exports: [RabbitmqPublisher],
})
export class RabbitmqWrapperModule {}
