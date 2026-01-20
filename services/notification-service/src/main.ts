import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =========================
  // Swagger configuration
  // =========================
  const config = new DocumentBuilder()
    .setTitle('Notification Service API')
    .setDescription(
      'Notification microservice responsible for handling email and real-time notifications using Event-Driven Architecture (RabbitMQ + MQTT).'
    )
    .setVersion('1.0')
    .addTag('health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3007);

  console.log('🚀 Notification Service running on http://localhost:3007');
  console.log('📚 Swagger available at http://localhost:3007/docs');
}

bootstrap();
