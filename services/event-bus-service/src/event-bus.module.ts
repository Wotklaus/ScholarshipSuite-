import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { EventProducerService } from './events/producers/event-producer.service';
import { EventConsumerService } from './events/consumers/event-consumer.service';

@Module({
  providers: [
    KafkaService,
    EventProducerService,
    EventConsumerService,
  ],
  exports: [EventProducerService],
})
export class EventBusModule {}
