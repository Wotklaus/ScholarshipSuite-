import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ContractService } from './contract.service';
import { FinalizeContractDto } from './dtos/finalize-contract.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) { }

  @Get('health')
  health() {
    return { ok: true };
  }


  @Get('dynamic')
  async dynamic(@Req() req: Request, @Res() res: Response) {
    console.log('[contracts/dynamic] Raw cookie header:', req.headers.cookie);
    console.log('[contracts/dynamic] Parsed cookies:', req.cookies);

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
   * ✅ Receives multipart/form-data:
   * - file (PDF)
   * - bankName, accountType, accountNumber, holderName, identification
   *
   * This endpoint:
   * 1) Upserts bank account (bank_accounts)
   * 2) Stores certificate PDF on disk
   * 3) Registers metadata on DB (bank_certificates)
   */
  @Post('bank-account')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // ✅ IMPORTANT: guarantees file.buffer exists
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        if (!isPdf) return cb(new Error('Only PDF files are allowed.'), false);
        cb(null, true);
      },
    }),
  )
  async upsertBankAccount(
    @Req() req: Request,
    @UploadedFile() file: any,
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

  /**
   * ✅ Download the latest bank certificate for the logged user
   */
  @Get('bank-certificate/latest')
  async downloadMyLatestCertificate(@Req() req: Request, @Res() res: Response) {
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) {
      throw new UnauthorizedException('Missing auth cookie token');
    }

    const result = await this.contractService.getLatestCertificateFileFromToken(token);
    res.setHeader('Content-Type', 'application/pdf');
    return res.download(result.filePath, result.downloadName);
  }

  /**
   * ✅ Admin download by userId (later you can protect by role)
   */
  @Get('bank-certificate/:userId/latest')
  async downloadLatestCertificateByUserId(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const result = await this.contractService.getLatestCertificateFileByUserId(userId);
    res.setHeader('Content-Type', 'application/pdf');
    return res.download(result.filePath, result.downloadName);
  }


  @Post('finalize')
  async finalize(@Req() req: Request, @Body() dto: FinalizeContractDto) {
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) {
      throw new UnauthorizedException('Missing auth cookie token');
    }

    return this.contractService.finalizeContractFromToken(token, dto);
  }



}
