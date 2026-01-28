export class UpsertBankAccountDto {
  bankName: string;
  accountType: string;
  accountNumber: string;
  holderName?: string;
}
