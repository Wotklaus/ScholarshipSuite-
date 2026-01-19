import { BankCertificateUploadedDto } from '../dto/bank-certificate-uploaded.dto';

export class BankCertificateUploadedHandler {
  handle(event: BankCertificateUploadedDto) {
    console.log('📩 [NOTIFICATION] Bank certificate uploaded by user:', event.userId);
  }
}
