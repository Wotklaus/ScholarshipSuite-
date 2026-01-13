import { Injectable } from '@nestjs/common';

// ✅ Import directo de pdfjs legacy (funciona en Node)
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export type ParsedBankCertificate = {
  text: string;
  identification?: string;
  holderName?: string;
  bankName?: string;
  accountNumber?: string;
  accountType?: 'AHORROS' | 'CORRIENTE' | string;
};

@Injectable()
export class BankCertificateService {
  // ✅ Extrae texto del PDF (si el PDF tiene texto embebido)
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    const u8 = new Uint8Array(buffer);

    // ✅ CLAVE: getDocument con { data } y disableWorker en Node
    const loadingTask = (pdfjsLib as any).getDocument({
      data: u8,
      disableWorker: true,
    });

    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = (content.items || [])
        .map((it: any) => (it.str ? String(it.str) : ''))
        .join(' ');

      fullText += pageText + '\n';
    }

    return fullText.trim();
  }

  // ✅ Parser simple para certificados estilo Banco Pichincha
  private parseFromText(text: string): ParsedBankCertificate {
    const clean = text.replace(/\s+/g, ' ').trim();

    // Banco
    let bankName: string | undefined;
    if (/banco\s+pichincha/i.test(clean)) bankName = 'BANCO PICHINCHA';

    // Titular (línea: "Sr.(a) NOMBRE APELLIDO")
    let holderName: string | undefined;
    const holderMatch = clean.match(/Sr\.\(a\)\s+([A-ZÁÉÍÓÚÑ ]+?)\s+(Presente\.|Tenemos a bien)/i);
    if (holderMatch?.[1]) holderName = holderMatch[1].trim().toUpperCase();

    // Cédula / identificación
    let identification: string | undefined;
    const idMatch = clean.match(/Identificaci[oó]n\s+No\.?\s*([0-9]{10})/i);
    if (idMatch?.[1]) identification = idMatch[1];

    // Cuenta + tipo
    // Busca patrones tipo: "2206045497 Cuenta de Ahorro"
    let accountNumber: string | undefined;
    let accountType: string | undefined;

    const accMatch = clean.match(/(\d{8,20})\s+Cuenta\s+de\s+(Ahorro|Ahorros|Corriente)/i);
    if (accMatch?.[1]) accountNumber = accMatch[1];
    if (accMatch?.[2]) {
      const t = accMatch[2].toLowerCase();
      if (t.includes('ahor')) accountType = 'AHORROS';
      if (t.includes('corr')) accountType = 'CORRIENTE';
    }

    return {
      text,
      identification,
      holderName,
      bankName,
      accountNumber,
      accountType,
    };
  }

  // ✅ Método que llama el controller
  async parsePdf(buffer: Buffer): Promise<ParsedBankCertificate> {
    console.log('[validation] buffer bytes:', buffer.length);

    const text = await this.extractTextFromPdf(buffer);

    console.log('[validation] extracted text length:', text.length);
    console.log('[validation] extracted text preview:', text.slice(0, 220));

    // Si sale vacío, es PDF imagen => ahí ya toca OCR (Textract/Tesseract)
    if (!text || text.length < 20) {
      return { text: '' };
    }

    return this.parseFromText(text);
  }
}
