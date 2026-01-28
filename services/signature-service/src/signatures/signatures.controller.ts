import { Body, Controller, Get, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SignaturesService } from './signatures.service';
import { StartSignatureDto } from './dtos/start-signature.dto';
import { ConfirmSignatureDto } from './dtos/confirm-signature.dto';

@ApiTags('signatures')
@Controller('signatures')
export class SignaturesController {
  constructor(private readonly service: SignaturesService) {}

  @Get('health')
  health() {
    return this.service.health();
  }

  @Post('start')
  async start(@Req() req: Request, @Body() dto: StartSignatureDto) {
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) throw new UnauthorizedException('Missing auth cookie token');

    return this.service.startSignature(token, dto);
  }

  @Post('confirm')
  async confirm(@Req() req: Request, @Body() dto: ConfirmSignatureDto) {
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) throw new UnauthorizedException('Missing auth cookie token');

    return this.service.confirmSignature(token, dto);
  }

  @Get('latest')
  async latest(@Req() req: Request, @Query('contractId') contractId: string) {
    const token =
      req.cookies?.access_token ||
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.Authentication;

    if (!token) throw new UnauthorizedException('Missing auth cookie token');

    return this.service.latestForContract(token, contractId);
  }
}
