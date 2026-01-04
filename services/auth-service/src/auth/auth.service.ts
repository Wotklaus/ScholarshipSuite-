import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as crypto from 'crypto'; // Usamos crypto para encriptar contraseñas

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Repositorio para interactuar con la DB
    private readonly jwtService: JwtService, // Servicio para generar el token JWT
  ) {}

  // Método para validar al usuario
  async validateUser(email: string, password: string): Promise<User | null> {
    // Buscamos al usuario por email y cargamos el rol
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'], // Cargar la relación del rol del usuario
    });

    if (!user) {
      console.log('User not found'); // Usuario no encontrado
      return null;
    }

    // Comparar contraseñas
    const passwordsMatch = this.comparePasswords(password, user.password);
    if (!passwordsMatch) {
      console.log('Passwords do not match'); // Contraseñas no coinciden
      return null;
    }

    return user; // Usuario encontrado y válido
  }

  // Método para comparar contraseñas ingresadas con las almacenadas
  comparePasswords(password: string, hashedPassword: string): boolean {
    const hash = this.hashPassword(password); // Hashear la contraseña ingresada
    return hash === hashedPassword; // Comparar hashes
  }

  // Método para encriptar contraseñas con SHA-256
  hashPassword(password: string): string {
    const hash = crypto.createHash('sha256').update(password).digest('hex'); // Generamos el hash
    console.log('Generated hash:', hash); // Imprimir el hash generado
    return hash;
  }

  // Método para generar el token JWT
  async login(user: User) {
    // Payload del token
    const payload = { id: user.id, email: user.email, role: user.role.name }; // Incluye datos del usuario
    console.log('Payload:', payload); // Imprimir lo que vamos a firmar
    return {
      accessToken: this.jwtService.sign(payload), // Generar y devolver el token
    };
  }
}