import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractTemplate } from './entities/contract-template.entity';
import { Contract } from './entities/contract.entity';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(ContractTemplate)
    private readonly contractTemplateRepository: Repository<ContractTemplate>,
  ) {}

  // Generar contrato basado en datos del usuario
  async generateContract(userId: string): Promise<Buffer> {
    // Obtener datos del usuario desde la base de datos (simulación)
    const contractData = await this.contractRepository.findOne({
      where: { userId }, // Consulta el contrato del usuario
      relations: ['template'], // Incluye la plantilla relacionada
    });

    if (!contractData) {
      throw new Error(`No se encontró información para el usuario ID: ${userId}`);
    }

    const userTemplate = contractData.template;

    // Tomar la plantilla PDF estática
    const pdfPath = path.resolve(__dirname, '../templates/Template-Exc.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Cargar el PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Mapear datos dinámicos en el PDF
    firstPage.drawText(`Nombre: ${contractData.userId}`, { x: 50, y: 700 });
    firstPage.drawText(`Cuenta Bancaria: ${contractData.budgetItem}`, { x: 50, y: 680 });
    firstPage.drawText(`Periodo Académico: ${contractData.scholarshipPeriod}`, { x: 50, y: 650 });
    firstPage.drawText(`Número Oficial: ${contractData.officialNumber}`, { x: 50, y: 630 });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes); // Retorna el PDF dinámico generado
  }
}