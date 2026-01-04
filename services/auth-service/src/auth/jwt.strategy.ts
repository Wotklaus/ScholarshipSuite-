import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config(); // Carga las configuraciones del archivo .env

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'fallbackSecretKey',
    });
  }

  async validate(payload: any) {
    // Aquí defines qué datos del 'payload' recibes y cómo procesarlos.
    return {
      userId: payload.sub, // ID del usuario desde el token
      email: payload.email, // Email del usuario
      role: payload.role, // Rol del usuario, si lo incluyes en el JWT
    };
  }
}