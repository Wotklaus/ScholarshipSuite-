import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Permitir solicitudes desde el frontend
    credentials: true, // Permitir el envío de cookies
  });

  await app.listen(3000);
}
bootstrap();