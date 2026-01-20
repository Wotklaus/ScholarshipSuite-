import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // =========================
  // Health Check Endpoint
  // =========================
  @Get('health')
  @ApiOperation({ summary: 'Health check for Notification Service' })
  @ApiResponse({
    status: 200,
    description: 'Notification Service is up and running',
    schema: {
      example: {
        status: 'ok',
        service: 'notification-service',
        timestamp: '2026-01-20T00:00:00.000Z',
      },
    },
  })
  health() {
    return {
      status: 'ok',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
    };
  }
}
