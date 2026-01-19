import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🚫 YA NO USAMOS connectMicroservice() CON RMQ
  // RabbitMQModule ya maneja TODA la conexión.

  await app.listen(3007);

  console.log('🚀 Notification Service running on http://localhost:3007');
  console.log('📨 RabbitMQ connected via RabbitMQModule');
}

bootstrap();
