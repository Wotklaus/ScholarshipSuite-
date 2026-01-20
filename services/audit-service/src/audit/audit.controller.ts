import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {

  @Get('health')
  @ApiOperation({ summary: 'Audit service health check' })
  health() {
    return {
      status: 'ok',
      service: 'audit-service',
      timestamp: new Date().toISOString(),
    };
  }
}
