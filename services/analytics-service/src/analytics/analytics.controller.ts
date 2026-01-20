import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return {
      status: 'ok',
      service: 'analytics-service',
      timestamp: Date.now(),
    };
  }

  @Get('contracts/:userId')
  @ApiOperation({ summary: 'Get cached contract summary for user' })
  async getContract(@Param('userId') userId: string) {
    const data = await this.analyticsService.getContractSummary(userId);
    return data ?? { cached: false };
  }
}
