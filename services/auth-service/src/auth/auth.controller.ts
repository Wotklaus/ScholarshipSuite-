import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { ThrottlerGuard } from '@nestjs/throttler'; // Importar el guard para rate limiting

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Repositorio de usuarios
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Repositorio de roles
  ) {}

  // Endpoint de login
  @UseGuards(ThrottlerGuard) // Aplicamos Rate Limiting aquí
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // Validar usuario
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Error si no es válido
    }

    // Generar y devolver el token JWT
    return this.authService.login(user);
  }
}