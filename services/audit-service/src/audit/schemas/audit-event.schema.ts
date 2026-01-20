import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditEvent extends Document {
  @Prop({ required: true })
  eventType: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  aggregate: string;

  @Prop()
  aggregateId?: string;

  @Prop({ type: Object })
  payload: any;

  @Prop({ required: true })
  timestamp: number;
}

export const AuditEventSchema =
  SchemaFactory.createForClass(AuditEvent);
