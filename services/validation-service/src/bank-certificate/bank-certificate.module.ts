import { Module } from "@nestjs/common";
import { BankCertificateController } from "./bank-certificate.controller";
import { BankCertificateService } from "./bank-certificate.service";
import { EventProducerService } from "../events/event-producer.service";

@Module({
  controllers: [BankCertificateController],
  providers: [
    BankCertificateService,
    EventProducerService, // ⬅️ ESTE ERA EL QUE FALTABA
  ],
  exports: [
    EventProducerService,  // ⬅️ opcional pero recomendado
  ],
})
export class BankCertificateModule {}
