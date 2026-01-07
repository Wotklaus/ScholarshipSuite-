import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  // Endpoint para generar el contrato dinámico
  @Get('dynamic')
  async generateDynamicContract(
    @Query('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.contractService.generateContract(userId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename=dynamic-contract.pdf',
      );
      res.send(pdfBuffer);
    } catch (error) {
      res.status(404).send(`Error: ${error.message}`);
    }
  }

  // Endpoint para servir la plantilla estática directamente desde src/templates
  @Get('template')
  getTemplate(@Res() res: Response): void {
    try {
      // Ruta directamente al archivo en src/templates
      const filePath = path.resolve(__dirname, '../../src/templates/Template-Exc.pdf');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename=template.pdf',
      );

      res.sendFile(filePath); // Servir el archivo desde src/templates
    } catch (error) {
      res
        .status(404)
        .send(`Error: No se pudo encontrar la plantilla (${error.message})`);
    }
  }
}