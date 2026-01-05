import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'becas',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default', // Nombre del throttle
          ttl: 60000, // Ventana de tiempo en milisegundos (1 minuto)
          limit: 10, // Máximo de solicitudes permitidas por ventana
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Aplicar el guard globalmente en el sistema
    },
  ],
})
export class AppModule {}