import { NestFactory } from '@nestjs/core';
import { EventBusModule } from './event-bus.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventProducerService } from './events/producers/event-producer.service';

async function bootstrap() {
  const app = await NestFactory.create(EventBusModule);

  // 🔥 SWAGGER CONFIG
  const config = new DocumentBuilder()
    .setTitle('Event Bus Service')
    .setDescription('Microservicio encargado de centralizar la comunicación por eventos utilizando Kafka')
    .setVersion('1.0')
    .addTag('event-bus')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // TEST ROUTE (DEMO)
  const producer = app.get(EventProducerService);
  app.getHttpAdapter().get('/test/login', async () => {
    await producer.emitUserLoggedIn({
      userId: '123',
      timestamp: new Date().toISOString(),
    });
    return { ok: true };
  });

  await app.listen(3005);
  console.log(`🚀 Event Bus running on http://localhost:3005`);
  console.log(`📘 Swagger: http://localhost:3005/docs`);
}
bootstrap();
