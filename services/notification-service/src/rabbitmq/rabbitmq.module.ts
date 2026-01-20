import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from './rabbitmq.service';
import { EmailModule } from '../email/email.module';
import { RabbitmqConsumer } from './rabbitmq.consumer';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [
    MqttModule,
    EmailModule,

    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
      exchanges: [
        {
          name: 'notifications',
          type: 'topic',
        },
      ],
      connectionInitOptions: { wait: false },
      channels: {
        'notification-channel': {
          prefetchCount: 5,
          default: true,
        },
      },
    }),
  ],
  providers: [RabbitmqService, RabbitmqConsumer],
  exports: [RabbitmqService],
})
export class RabbitmqWrapperModule {}
