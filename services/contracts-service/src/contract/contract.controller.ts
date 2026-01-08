import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get('dynamic')
  async generateContract(@Res() res: Response) {
    const pdf = await this.contractService.generateContract();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=contrato-beca.pdf',
    });

    res.send(pdf);
  }
}
