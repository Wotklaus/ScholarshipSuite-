import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { EventProducerService } from './events/producers/event-producer.service';
import { EventConsumerService } from './events/consumers/event-consumer.service';
import { HealthController } from './health.controller';

// ⬅️ NUEVO
import { RabbitmqWrapperModule } from './rabbitmq/rabbitmq.module';

@Module({
  controllers: [HealthController],
  imports: [RabbitmqWrapperModule], // ⬅️ AÑADIDO
  providers: [
    KafkaService,
    EventProducerService,
    EventConsumerService,
  ],
  exports: [EventProducerService],
})
export class EventBusModule {}
