import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomInt } from 'crypto';
import { ContractSignature } from './entities/contract-signature.entity';
import { StartSignatureDto } from './dtos/start-signature.dto';
import { ConfirmSignatureDto } from './dtos/confirm-signature.dto';
import { EventProducerService } from './events/event-producer.service';
import { Topics } from './events/topics';




@Injectable()
export class SignaturesService {
  constructor(
    @InjectRepository(ContractSignature)
    private readonly repo: Repository<ContractSignature>,
    private readonly jwtService: JwtService,
    private readonly eventProducer: EventProducerService,
  ) { }

  private getUserIdFromToken(token: string): string {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    const userId = payload?.sub || payload?.id || payload?.userId;
    if (!userId) throw new UnauthorizedException('Token without user id');
    return userId;
  }

  async health() {
    return { ok: true };
  }

  async startSignature(token: string, dto: StartSignatureDto) {
    const userId = this.getUserIdFromToken(token);

    if (!dto?.contractId || !dto?.method) {
      throw new BadRequestException('contractId and method are required');
    }

    const method = dto.method;
    const isValid = method === 'ELECTRONIC' || method === 'MANUAL';
    if (!isValid) throw new BadRequestException('Invalid method');

    const signature = this.repo.create({
      contractId: dto.contractId,
      userId,
      method,
      status: 'PENDING',
      provider: 'MOCK',
      challengeCode: method === 'ELECTRONIC' ? String(randomInt(100000, 999999)) : null,
      signatureHash: null,
      signedAt: null,
    });

    const saved = await this.repo.save(signature);

    console.log(
      `[signatures] Signature started. user=${userId} contract=${dto.contractId} method=${method} signatureId=${saved.id}`,
    );

    return {
      ok: true,
      signatureId: saved.id,
      status: saved.status,
      method: saved.method,
      provider: saved.provider,
      // In a real provider you would redirect to signing page.
      // Here we return a mock code to confirm the signature.
      challengeCode: saved.challengeCode,
    };
  }

  async confirmSignature(token: string, dto: ConfirmSignatureDto) {
    const userId = this.getUserIdFromToken(token);

    if (!dto?.signatureId) {
      throw new BadRequestException('signatureId is required');
    }

    const sig = await this.repo.findOne({ where: { id: dto.signatureId } });
    if (!sig) throw new NotFoundException('Signature request not found');

    if (sig.userId !== userId) {
      throw new UnauthorizedException('You cannot confirm this signature request');
    }

    if (sig.status !== 'PENDING') {
      throw new BadRequestException(`Signature is not pending (current=${sig.status})`);
    }

    if (sig.method === 'ELECTRONIC') {
      if (!dto.code) throw new BadRequestException('code is required for electronic signature');
      if (sig.challengeCode !== String(dto.code).trim()) {
        throw new BadRequestException('Invalid confirmation code');
      }
    }

    // Mock "receipt hash"
    const hash = createHash('sha256')
      .update(`${sig.id}|${sig.contractId}|${sig.userId}|${Date.now()}`)
      .digest('hex');

    sig.status = 'SIGNED';
    sig.signatureHash = hash;
    sig.signedAt = new Date();
    sig.challengeCode = null;

    const saved = await this.repo.save(sig);

    console.log(
      `[signatures] Signature confirmed. user=${userId} signatureId=${saved.id} hash=${saved.signatureHash}`,
    );

    // ⬅️ EMITIR EVENTO AQUÍ
    await this.eventProducer.emit(Topics.SIGNATURE_COMPLETED, {
      signatureId: saved.id,
      userId: saved.userId,
      contractId: saved.contractId,
      signatureHash: saved.signatureHash,
      signedAt: saved.signedAt,
      timestamp: Date.now(),
    });

    console.log(`[signatures] 📤 SIGNATURE_COMPLETED event emitted`);

    return {
      ok: true,
      signatureId: saved.id,
      status: saved.status,
      signatureHash: saved.signatureHash,
      signedAt: saved.signedAt,
    };
  }

  async latestForContract(token: string, contractId: string) {
    const userId = this.getUserIdFromToken(token);

    if (!contractId) throw new BadRequestException('contractId is required');

    const latest = await this.repo.findOne({
      where: { contractId, userId },
      order: { createdAt: 'DESC' as any },
    });

    return {
      ok: true,
      contractId,
      signature: latest ?? null,
    };
  }
}
