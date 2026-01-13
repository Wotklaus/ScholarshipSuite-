import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get('dynamic')
  async dynamic(@Req() req: Request, @Res() res: Response) {
    console.log('[contracts/dynamic] raw cookie header:', req.headers.cookie);
    console.log('[contracts/dynamic] parsed cookies:', req.cookies);

    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) {
      throw new UnauthorizedException('Missing auth cookie token');
    }

    const pdfBuffer = await this.contractService.generateContractFromToken(token);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="contract.pdf"');
    return res.send(pdfBuffer);
  }

  /**
   * ✅ Recibe multipart/form-data:
   * - file (pdf)
   * - bankName, accountType, accountNumber, holderName, identification
   */
  @Post('bank-account')
  @UseInterceptors(FileInterceptor('file'))
  async upsertBankAccount(
    @Req() req: Request,
    @UploadedFile() file: any, // <- evitamos líos de types en Windows
    @Body() body: any,
  ) {
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) {
      throw new UnauthorizedException('Missing auth cookie token');
    }

    return this.contractService.upsertBankAccountFromToken(token, body, file);
  }
}
