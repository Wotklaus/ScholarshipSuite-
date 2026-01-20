import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Res,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// 👇 IMPORTAMOS EL CLIENTE DEL EVENT BUS
import { EventBusClient } from '../events/event-bus.client';
import { Topics } from '../events/topics';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login and issue JWT (httpOnly cookie)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@uce.edu.ec' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns accessToken and sets httpOnly cookie access_token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;

    this.logger.log(`Login attempt for email=${email}`);

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      this.logger.warn(`Login failed for email=${email} (invalid credentials)`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken } = await this.authService.login(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    this.logger.log(`Login success for email=${email} userId=${user.id}`);

    // 🔥 EMITIR EVENTO A KAFKA
    const eventBus = new EventBusClient();
    await eventBus.emitUserLoggedIn({
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
    });

    return { accessToken };
  }
}
