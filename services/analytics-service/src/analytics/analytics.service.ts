import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async cacheContractSummary(userId: string, data: any) {
    const key = `contract:user:${userId}`;
    await this.redis.set(key, JSON.stringify(data));
    this.logger.log(`📦 Cached contract summary for user=${userId}`);
  }

  async getContractSummary(userId: string) {
    const key = `contract:user:${userId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
}
