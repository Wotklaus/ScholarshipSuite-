import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContractGeneratedHandler {
  private readonly logger = new Logger(ContractGeneratedHandler.name);

  constructor(private readonly email: EmailService) {}

  async handle(data: any) {
    this.logger.log(`📥 Evento CONTRACT_GENERATED → ${JSON.stringify(data)}`);

    await this.email.send(
      data.email,
      'Contrato generado',
      `<p>Tu contrato ha sido generado exitosamente.</p>`
    );
  }
}
