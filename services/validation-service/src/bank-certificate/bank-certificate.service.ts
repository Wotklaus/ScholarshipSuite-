import { Injectable, Logger } from "@nestjs/common";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { ParseResponseDto } from "./dto/parse-response.dto";
import { EventProducerService } from "../events/event-producer.service";
import { Topics } from "../events/topics";

@Injectable()
export class BankCertificateService {
  private readonly logger = new Logger(BankCertificateService.name);

  constructor(
    private readonly eventProducer: EventProducerService, // ⬅️ INYECTAMOS EL PRODUCTOR
  ) {}

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

    let bankName: string | undefined;
    if (/banco\s+pichincha/i.test(clean)) bankName = "BANCO PICHINCHA";

    let holderName: string | undefined;
    const holderMatch = clean.match(
      /Sr\.\(a\)\s+([A-ZÁÉÍÓÚÑ ]+?)\s+(Presente\.|Tenemos a bien)/i
    );
    if (holderMatch?.[1]) holderName = this.normalizeUpper(holderMatch[1]);

    let identification: string | undefined;
    const idMatch =
      clean.match(/Identificaci[oó]n\s+No\.?\s*([0-9]{10})/i) ||
      clean.match(/Documento\s+de\s+Identificaci[oó]n\s+No\.?\s*([0-9]{10})/i);
    if (idMatch?.[1]) identification = idMatch[1];

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
    this.logger.log(`[validation] Parsing bank certificate… bytes=${buffer.length}`);

    const text = await this.extractTextFromPdf(buffer);
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

    if (options?.includeRawText) dto.rawText = parsed.rawText;

    // ⬅️ EMITIR EVENTO A KAFKA AQUÍ
    await this.eventProducer.emit(Topics.BANK_CERTIFICATE_UPLOADED, {
      certificate: dto,
      timestamp: Date.now(),
    });

    this.logger.log(`📤 BANK_CERTIFICATE_UPLOADED event emitted`);

    return dto;
  }
}
