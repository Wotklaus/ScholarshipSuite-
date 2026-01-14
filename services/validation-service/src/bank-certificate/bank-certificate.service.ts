import { Injectable } from "@nestjs/common";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { ParseResponseDto } from "./dto/parse-response.dto";

@Injectable()
export class BankCertificateService {
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    const u8 = new Uint8Array(buffer);

    const loadingTask = (pdfjsLib as any).getDocument({
      data: u8,
      disableWorker: true,
    });

    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = (content.items || [])
        .map((it: any) => (it.str ? String(it.str) : ""))
        .join(" ");

      fullText += pageText + "\n";
    }

    return fullText.trim();
  }

  private cleanSpaces(text: string) {
    return text.replace(/\s+/g, " ").trim();
  }

  private normalizeUpper(value: any): string | undefined {
    const s = String(value ?? "").trim();
    return s ? s.toUpperCase() : undefined;
  }

  private computeConfidence(parsed: {
    bankName?: string;
    identification?: string;
    holderName?: string;
    accountNumber?: string;
    accountType?: string;
  }): number {
    // Simple heuristic: 0.2 per key field (max 1.0)
    const fields = [
      parsed.bankName,
      parsed.identification,
      parsed.holderName,
      parsed.accountNumber,
      parsed.accountType,
    ];
    const hits = fields.filter(Boolean).length;
    return Math.min(1, hits * 0.2);
  }

  private parseFromText(text: string): Omit<ParseResponseDto, "confidence"> & { rawText: string } {
    const clean = this.cleanSpaces(text);

    // Bank
    let bankName: string | undefined;
    if (/banco\s+pichincha/i.test(clean)) bankName = "BANCO PICHINCHA";

    // Holder name: "Sr.(a) NAME ... Presente.-"
    let holderName: string | undefined;
    const holderMatch = clean.match(
      /Sr\.\(a\)\s+([A-ZÁÉÍÓÚÑ ]+?)\s+(Presente\.|Tenemos a bien)/i
    );
    if (holderMatch?.[1]) holderName = this.normalizeUpper(holderMatch[1]);

    // Identification: "Identificación No.1725..."
    let identification: string | undefined;
    const idMatch =
      clean.match(/Identificaci[oó]n\s+No\.?\s*([0-9]{10})/i) ||
      clean.match(/Documento\s+de\s+Identificaci[oó]n\s+No\.?\s*([0-9]{10})/i);
    if (idMatch?.[1]) identification = idMatch[1];

    // Account + type: "2206045497 Cuenta de Ahorro"
    let accountNumber: string | undefined;
    let accountType: string | undefined;

    const accMatch = clean.match(/(\d{8,20})\s+Cuenta\s+de\s+(Ahorro|Ahorros|Corriente)/i);
    if (accMatch?.[1]) accountNumber = accMatch[1];
    if (accMatch?.[2]) {
      const t = accMatch[2].toLowerCase();
      if (t.includes("ahor")) accountType = "AHORROS";
      if (t.includes("corr")) accountType = "CORRIENTE";
    }

    return {
      bankName,
      identification,
      holderName,
      accountNumber,
      accountType,
      currency: "USD",
      rawText: text,
    };
  }

  async parsePdf(buffer: Buffer, options?: { includeRawText?: boolean }): Promise<ParseResponseDto> {
    console.log(`[validation] Bank certificate parsing started. bytes=${buffer.length}`);

    const text = await this.extractTextFromPdf(buffer);

    console.log(`[validation] Extracted text length=${text.length}`);
    console.log(`[validation] Extracted text preview="${text.slice(0, 220)}"`);

    if (!text || text.length < 20) {
      // Probably scanned image (OCR needed)
      console.log("[validation] No embedded text found. OCR is required for scanned PDFs.");
      return {
        confidence: 0,
      };
    }

    const parsed = this.parseFromText(text);
    const confidence = this.computeConfidence(parsed);

    const dto: ParseResponseDto = {
      bankName: parsed.bankName,
      identification: parsed.identification,
      holderName: parsed.holderName,
      accountNumber: parsed.accountNumber,
      accountType: parsed.accountType,
      currency: parsed.currency,
      confidence,
    };

    if (options?.includeRawText) {
      dto.rawText = parsed.rawText;
    }

    console.log(
      `[validation] Parsed result bankName=${dto.bankName ?? "N/A"} accountType=${dto.accountType ?? "N/A"} accountNumber=${dto.accountNumber ?? "N/A"} confidence=${dto.confidence}`
    );

    return dto;
  }
}
