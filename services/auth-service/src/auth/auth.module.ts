import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'; // Asegúrate de importar JwtModule
import { JwtStrategy } from './jwt.strategy';
import { User } from '../entities/user.entity'; // Entidad User
import { Role } from '../entities/role.entity'; // Entidad Role

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]), // Entidades del módulo
    JwtModule.register({ // Configuración del módulo JwtModule
      secret: process.env.JWT_SECRET, // Secret desde .env
      signOptions: { expiresIn: '1h' }, // Tiempo de expiración
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}