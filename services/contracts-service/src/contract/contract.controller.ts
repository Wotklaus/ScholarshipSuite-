import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get('dynamic')
  async dynamic(@Req() req: Request, @Res() res: Response) {
    // ✅ DEBUG (para ver si llegan cookies)
    console.log('[contracts/dynamic] raw cookie header:', req.headers.cookie);
    console.log('[contracts/dynamic] parsed cookies:', req.cookies);

    // ✅ 1) sacar el token desde cookie (pon aquí TODOS los nombres posibles)
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication; // <- común en auth apps

    if (!token) {
      throw new UnauthorizedException('Missing auth cookie token');
    }

    // ✅ 2) generar pdf usando token
    const pdfBuffer = await this.contractService.generateContractFromToken(
      token,
    );

    // ✅ 3) responder inline PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="contract.pdf"');
    return res.send(pdfBuffer);
  }
}
