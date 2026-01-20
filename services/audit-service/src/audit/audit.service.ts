import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditEvent } from './schemas/audit-event.schema';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditEvent.name)
    private readonly auditModel: Model<AuditEvent>,
  ) {}

  async saveEvent(event: {
    eventType: string;
    source: string;
    aggregate: string;
    aggregateId?: string;
    payload: any;
    timestamp: number;
  }) {
    await this.auditModel.create(event);
    this.logger.log(`🧾 Event saved → ${event.eventType}`);
  }
}
