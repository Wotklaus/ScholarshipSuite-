import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ parse cookies (req.cookies)
  app.use(cookieParser());

  // ✅ DTO validation globally (FinalizeContractDto etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // ✅ CORS for Next.js
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('Contracts Service API')
    .setDescription('Contract generation, bank certificate ingestion and contract finalization')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`[bootstrap] Contracts-service running on http://localhost:${port}`);
  console.log(`[bootstrap] Swagger docs available on http://localhost:${port}/docs`);
}

bootstrap();
