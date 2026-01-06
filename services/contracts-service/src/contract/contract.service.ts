import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  // Método: Generar contrato sin guardarlo
  async generateContract(createContractDto): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // Rellena los datos dinámicos en el PDF
    page.drawText(`Nombre del Becario: ${createContractDto.firstName} ${createContractDto.lastName}`, { x: 50, y: 750 });
    page.drawText(`Cédula: ${createContractDto.identification}`, { x: 50, y: 730 });
    page.drawText(`Facultad: ${createContractDto.faculty}`, { x: 50, y: 710 });
    page.drawText(`Periodo Académico: ${createContractDto.scholarshipPeriod}`, { x: 50, y: 690 });
    page.drawText(`Cuenta Bancaria: ${createContractDto.accountNumber}`, { x: 50, y: 670 });
    page.drawText(`Banco: ${createContractDto.bankName}`, { x: 50, y: 650 });

    // Guarda el PDF como Uint8Array
    const pdfBytes = await pdfDoc.save();

    // Convierte Uint8Array a Buffer
    const pdfBuffer = Buffer.from(pdfBytes);

    return pdfBuffer; // Ahora retorna un Buffer
  }
}