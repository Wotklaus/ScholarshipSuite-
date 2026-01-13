export class ParseResponseDto {
  bankName: string;          // "BANCO PICHINCHA"
  identification: string;    // "1725..."
  holderName: string;        // "JADIRA ESTEFANIA CAIZA GUACHI"
  accountNumber: string;     // "2206045497"
  accountType: string;       // "AHORROS" | "CORRIENTE" | etc
  currency?: string;         // "USD"
  confidence: number;        // 0..1 (simple heurística)
  rawText?: string;          // opcional (debug)
}
