import { Module } from '@nestjs/common';
import { HealthController } from './healt.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
