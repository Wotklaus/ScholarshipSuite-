import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ContractService } from './contract.service';
import * as path from 'path';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) { }

  @Get('dynamic')
  async generateContract(@Res() res: Response) {
    const pdf = await this.contractService.generateContract();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=contrato-beca.pdf',
    });

    res.send(pdf);
  }

  @Get('template')
  getTemplate(@Res() res: Response) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'Template-Exc.pdf',
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=Template-Exc.pdf',
    });

    return res.sendFile(filePath);
  }
}
