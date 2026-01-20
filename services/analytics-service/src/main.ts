import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Analytics Service')
    .setDescription('Redis-based read model service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3009);
  console.log('📊 Analytics service running on http://localhost:3009');
  console.log('📘 Swagger on http://localhost:3009/docs');
}

bootstrap();
