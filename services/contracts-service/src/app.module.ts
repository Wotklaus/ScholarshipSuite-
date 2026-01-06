import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static'; // Importa el módulo estático
import { join } from 'path'; // Nos ayudará a definir la ruta
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables del .env estén disponibles globalmente
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Toma las variables del archivo .env
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Registra las entidades
      synchronize: true, // Cambiar a false en producción para evitar modificar automáticamente las tablas
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../src/templates'), // Define la carpeta de plantillas como estática
      serveRoot: '/static', // Ruta base para servir los archivos (http://localhost:3002/static)
    }),
    ContractModule, // Importa el módulo de contratos
  ],
})
export class AppModule {}