import { NestFactory } from '@nestjs/core';
import { EventBusModule } from './event-bus.module';

async function bootstrap() {
  console.log("🚀 Event Bus Service booting…");
  const app = await NestFactory.create(EventBusModule);

  await app.listen(3005);
  console.log('🚀 Event Bus Service running on http://localhost:3005');
}

bootstrap();
