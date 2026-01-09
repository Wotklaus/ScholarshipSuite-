import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ContractService {

  async generateContract(): Promise<Buffer> {

    // 1️⃣ DATOS MOCK (simulan la DB)
    const contractData = {
      academic_period: 'MAYO 2023 – SEPTIEMBRE 2023',
      contract_number: 'DBU-2023-BEA-0187',
      student_full_name: 'NICOLAS ANDRÉS PARRA LOZANO',
      student_id: '1751353424',
      faculty: 'CIENCIAS ADMINISTRATIVAS',
      career: 'ADMINISTRACIÓN DE EMPRESAS - REDISEÑO',
      scholarship_amount: '400',
      bank_name: 'BANCO PICHINCHA',
      bank_account: '2204676223',
      contract_date: '27 de febrero de 2025',
    };

    // 1️⃣.1 CARGAR LOGO EN BASE64 (⬅️ SOLO SE AÑADE ESTO)
    const logoPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'logouce.png',
    );

    const logoBase64 = fs.readFileSync(logoPath, 'base64');
    console.log('LOGO BASE64 LENGTH:', logoBase64.length);


    // 2️⃣ CARGAR PLANTILLA .HBS
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'scholarship-contract.hbs',
    );

    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // 3️⃣ COMPILAR HTML
    const template = Handlebars.compile(htmlTemplate);

    const html = template({
      ...contractData,
      logo: `data:image/png;base64,${logoBase64}`, // ⬅️ SE INYECTA AQUÍ
    });

    // 4️⃣ GENERAR PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    const pdfBuffer = Buffer.from(pdfUint8Array);
    await browser.close();

    return pdfBuffer;
  }
}
