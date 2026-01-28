import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user credentials (email + password)
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      this.logger.warn(`User not found for email=${email}`);
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      this.logger.warn(`Invalid password for email=${email}`);
      return null;
    }

    return user;
  }

  // Generate JWT token
  async login(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role.name };

    // Good evidence log (does not include token)
    this.logger.log(
      `Issuing JWT for userId=${user.id} role=${user.role.name} email=${user.email}`,
    );

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
