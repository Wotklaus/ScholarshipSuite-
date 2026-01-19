export class BankCertificateUploadedDto {
  certificate: {
    bankName: string;
    identification: string;
    holderName: string;
    accountNumber: string;
    accountType: string;
  };
  userId?: string; // opcional según tu proyecto
  timestamp: number;
}
