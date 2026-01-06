import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Permite solicitudes desde el frontend
    methods: 'GET,HEAD,POST,PUT,DELETE', // Métodos permitidos
    credentials: true, // Permite enviar cookies si es necesario
  });

  const port = process.env.PORT || 3002;
  await app.listen(port, () => {
    console.log(`Contracts-service escuchando en el puerto ${port}`);
  });
}
bootstrap();