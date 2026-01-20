import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from './audit/audit.module';
import { AppService } from './app.service';
import { KafkaAuditConsumer } from './kafka/kafka.consumer';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/scholarshipsuite_audit'),
    AuditModule,
  ],
  providers: [
    AppService,
    KafkaAuditConsumer, // 👈 IMPORTANTE
  ],
})
export class AppModule {}
