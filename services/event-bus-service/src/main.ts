import { NestFactory } from '@nestjs/core';
import { EventBusModule } from './event-bus.module';
import { EventProducerService } from './events/producers/event-producer.service';

async function bootstrap() {
  const app = await NestFactory.create(EventBusModule);

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
}
bootstrap();
