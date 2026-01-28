import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse cookies: req.cookies
  app.use(cookieParser());

  // CORS for Next.js
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Signature Service API')
    .setDescription('Mock signature workflow for scholarship contracts')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3004;
  await app.listen(port);

  console.log(`[bootstrap] Signature service running on http://localhost:${port}`);
  console.log(`[bootstrap] Swagger docs available on http://localhost:${port}/docs`);
}

bootstrap();
