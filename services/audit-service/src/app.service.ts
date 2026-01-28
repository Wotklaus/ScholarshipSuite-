import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AuditService } from './audit/audit.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly auditService: AuditService) {}

  async onModuleInit() {
    this.logger.log('🚀 Audit service booting...');
    await this.auditService.saveEvent({
      eventType: 'SYSTEM_BOOT',
      source: 'audit-service',
      aggregate: 'system',
      payload: { message: 'Audit service started' },
      timestamp: Date.now(),
    });
  }
}
