import { Module } from "@nestjs/common";
import { BankCertificateModule } from "./bank-certificate/bank-certificate.module";

@Module({
  imports: [BankCertificateModule],
})
export class AppModule {}
