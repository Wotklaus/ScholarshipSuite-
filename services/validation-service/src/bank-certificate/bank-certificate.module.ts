import { Module } from "@nestjs/common";
import { BankCertificateController } from "./bank-certificate.controller";
import { BankCertificateService } from "./bank-certificate.service";

@Module({
  controllers: [BankCertificateController],
  providers: [BankCertificateService],
})
export class BankCertificateModule {}
