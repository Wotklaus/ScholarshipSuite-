import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Enable built-in Nest logger levels (good evidence for professor)
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Parse cookies from incoming requests (required for cookie-based auth flows)
  app.use(cookieParser());

  // Enable CORS (frontend on Next.js)
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Swagger (API documentation)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ScholarshipSuite - Auth Service')
    .setDescription(
      'Authentication service for ScholarshipSuite. Provides login and issues JWT in an HTTP-only cookie.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDoc);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);

  const logger = new Logger('bootstrap');
  logger.log(`Auth service running on http://localhost:${port}`);
  logger.log(`Swagger docs available on http://localhost:${port}/docs`);
}

bootstrap();
