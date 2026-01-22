import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Cookies (OK)
  app.use(cookieParser());

  // ❌ NO CORS AQUÍ
  // ❌ NO app.enableCors()

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ScholarshipSuite - Auth Service')
    .setDescription('Authentication service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDoc);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);

  const logger = new Logger('bootstrap');
  logger.log(`Auth service running on http://localhost:${port}`);
}

bootstrap();
