import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'localhost', // Corriendo localmente
      port: 5432, // Puerto estándar
      username: 'postgres', // Usuario de PostgreSQL
      password: '123', // Contraseña de tu instancia
      database: 'becas', // Nombre de tu base (según la imagen)
      autoLoadEntities: true, // Autocarga las entidades (tablas)
      synchronize: true, // Solo para desarrollo (crea tablas automáticamente)
    }),
    AuthModule,
  ],
})
export class AppModule {}