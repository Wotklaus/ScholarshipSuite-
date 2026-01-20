import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';   // ⬅️ NECESARIO PARA LEER EL .env

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { MqttModule } from './mqtt/mqtt.module';
import { RabbitmqWrapperModule } from './rabbitmq/rabbitmq.module';
import { EmailModule } from './email/email.module';

// Handlers
import { UserLoggedHandler } from './handlers/user-logged.handler';
import { ContractGeneratedHandler } from './handlers/contract-generated.handler';
import { BankCertificateUploadedHandler } from './handlers/bank-certificate-uploaded.handler';
import { SignatureCompletedHandler } from './handlers/signature-completed.handler';

@Module({
  imports: [
    // 🔥 ESTO ERA LO QUE FALTABA
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MqttModule,
    RabbitmqWrapperModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserLoggedHandler,
    ContractGeneratedHandler,
    BankCertificateUploadedHandler,
    SignatureCompletedHandler,
  ],
})
export class AppModule {}
