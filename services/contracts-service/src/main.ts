import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ parsea cookies (req.cookies)
  app.use(cookieParser());

  // ✅ CORS para que Next pueda hablar con contracts-service
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Contracts-service escuchando en el puerto ${port}`);
}
bootstrap();
