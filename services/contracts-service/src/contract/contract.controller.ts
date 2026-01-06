import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';

@Controller('contracts')
export class ContractController {
  @Get('template')
  getTemplate(@Res() res: Response): void {
    // Ruta del archivo en la carpeta `dist/templates`
    const filePath = path.resolve(__dirname, '../templates/Template-Exc.pdf');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=template.pdf');
    res.sendFile(filePath); // Sirve el archivo PDF al cliente
  }
}