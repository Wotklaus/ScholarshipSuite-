import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import { Contract } from './entities/contract.entity';
import { User } from './entities/user.entity';
import { Scholar } from './entities/scholar.entity';
import { Faculty } from './entities/faculty.entity';
import { Career } from './entities/career.entity';
import { BankAccount } from './entities/bank-account.entity';
import { Bank } from './entities/bank.entity';
import { BankCertificate } from './entities/bank-certificate.entity';
import { FinalizeContractDto } from './dtos/finalize-contract.dto';
import { EventProducerService } from './events/event-producer.service';
import { Topics } from './events/topics';



@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Scholar)
    private readonly scholarRepo: Repository<Scholar>,

    @InjectRepository(Faculty)
    private readonly facultyRepo: Repository<Faculty>,

    @InjectRepository(Career)
    private readonly careerRepo: Repository<Career>,

    @InjectRepository(BankAccount)
    private readonly bankAccountRepo: Repository<BankAccount>,

    @InjectRepository(Bank)
    private readonly bankRepo: Repository<Bank>,

    @InjectRepository(BankCertificate)
    private readonly bankCertificateRepo: Repository<BankCertificate>,

    private readonly jwtService: JwtService,

    private readonly eventProducer: EventProducerService,
  ) { }

  // =========================
  // Helpers
  // =========================

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

  private toDate(value: any): Date {
    if (!value) return new Date(NaN);
    if (value instanceof Date) return value;
    return new Date(value);
  }

  private monthUpperES(d: Date): string {
    const months = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE',
    ];
    if (isNaN(d.getTime())) return 'PENDIENTE_DB';
    return months[d.getMonth()];
  }

  private formatAcademicPeriod(start: any, end: any): string {
    const s = this.toDate(start);
    const e = this.toDate(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'PENDIENTE_DB';
    return `${this.monthUpperES(s)} ${s.getFullYear()} – ${this.monthUpperES(
      e,
    )} ${e.getFullYear()}`;
  }

  private formatContractDate(createdAt: any): string {
    const d = this.toDate(createdAt);
    if (isNaN(d.getTime())) return 'PENDIENTE_DB';
    return d.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  private safe(value: any, fallback = 'PENDIENTE_DB'): string {
    if (value === null || value === undefined) return fallback;
    const s = String(value).trim();
    return s.length ? s : fallback;
  }

  private normalizeUpper(value: any): string {
    return String(value ?? '').trim().toUpperCase();
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  private sha256(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private async saveCertificateToDisk(userId: string, file: any) {
    if (!file?.buffer) return null;

    const uploadsRoot = path.join(
      process.cwd(),
      'uploads',
      'bank-certificates',
      userId,
    );
    this.ensureDir(uploadsRoot);

    const safeOriginal = String(file.originalname ?? 'certificate.pdf').replace(
      /[^\w.\- ]+/g,
      '_',
    );
    const filename = `${Date.now()}_${safeOriginal}`;
    const fullPath = path.join(uploadsRoot, filename);

    fs.writeFileSync(fullPath, file.buffer);

    return {
      filePath: fullPath,
      filename,
      mimeType: file.mimetype ?? 'application/octet-stream',
      size: file.size ?? file.buffer?.length ?? 0,
      hashSha256: this.sha256(file.buffer),
    };
  }

  // =========================
  // ✅ Upsert bank account + persist bank certificate metadata
  // =========================
  async upsertBankAccountFromToken(token: string, body: any, file?: any) {
    if (!body) {
      throw new BadRequestException(
        'Empty body. Ensure multipart/form-data is being sent.',
      );
    }

    const userId = this.getUserIdFromToken(token);

    const user = await this.userRepo.findOne({ where: { id: userId } as any });
    if (!user) throw new NotFoundException('User not found');

    const expectedIdentification = String((user as any).identification ?? '').trim();
    const certIdentification = String(body.identification ?? '').trim();

    // Optional: validate only if certificate identification is provided
    if (
      certIdentification &&
      expectedIdentification &&
      certIdentification !== expectedIdentification
    ) {
      console.warn(
        `[contracts] Certificate ID mismatch. expected=${expectedIdentification} got=${certIdentification}`,
      );
      throw new BadRequestException(
        'La cédula del certificado no coincide con tu usuario.',
      );
    }

    const bankName = this.normalizeUpper(body.bankName);
    const accountType = this.normalizeUpper(body.accountType);
    const accountNumber = String(body.accountNumber ?? '').trim();

    const defaultHolder = `${this.safe((user as any).firstName)} ${this.safe(
      (user as any).lastName,
    )}`.trim();
    const holderName = String(body.holderName ?? defaultHolder).trim();

    if (!bankName || !accountType || !accountNumber) {
      throw new BadRequestException(
        'bankName, accountType y accountNumber son obligatorios',
      );
    }

    // 1) Bank (create if missing)
    let bank = await this.bankRepo.findOne({
      where: { name: bankName } as any,
    });

    if (!bank) {
      const newBank = this.bankRepo.create({ name: bankName });
      bank = await this.bankRepo.save(newBank);
      console.log(`[contracts] Bank created: ${bankName} (${bank.id})`);
    }

    // 2) BankAccount (create/update)
    let acct = await this.bankAccountRepo.findOne({
      where: { userId } as any,
    });

    if (!acct) {
      acct = this.bankAccountRepo.create({
        userId,
        bankId: bank.id,
        accountType,
        accountNumber,
        holderName,
      });
      console.log(`[contracts] Bank account will be created for user=${userId}`);
    } else {
      acct.bankId = bank.id;
      acct.accountType = accountType;
      acct.accountNumber = accountNumber;
      acct.holderName = holderName;
      console.log(`[contracts] Bank account will be updated for user=${userId}`);
    }

    const savedAccount = await this.bankAccountRepo.save(acct);

    // 3) Store PDF on disk (optional if file missing)
    const savedFile = await this.saveCertificateToDisk(userId, file);

    // 4) Persist certificate metadata in DB (only if file exists)
    let savedCertificateId: string | null = null;

    if (savedFile) {
      const cert = this.bankCertificateRepo.create({
        user_id: userId,
        identification: certIdentification || expectedIdentification || '',
        bank_name: bankName,
        account_type: accountType,
        account_number: accountNumber,
        holder_name: holderName,
        file_path: savedFile.filePath,
      } as any);

      const savedCert = await this.bankCertificateRepo.save(cert);
      savedCertificateId = String((savedCert as any).id);

      console.log(
        `[contracts] Bank certificate saved. user=${userId} certId=${savedCertificateId} file=${savedFile.filename} sha256=${savedFile.hashSha256}`,
      );
    } else {
      console.warn(
        `[contracts] No certificate file provided. Only bank account was updated. user=${userId}`,
      );
    }

    return {
      ok: true,
      bankName,
      accountType,
      accountNumber,
      holderName,
      identification: certIdentification || expectedIdentification || null,
      bankAccountId: String(savedAccount.id),

      certificateStored: !!savedFile,
      certificateId: savedCertificateId,
      certificatePath: savedFile?.filePath ?? null,
      certificateFilename: savedFile?.filename ?? null,
      certificateSha256: savedFile?.hashSha256 ?? null,
    };
  }

  // =========================
  // ✅ Download helpers
  // =========================

  async getLatestCertificateFileFromToken(token: string): Promise<{
    filePath: string;
    downloadName: string;
  }> {
    const userId = this.getUserIdFromToken(token);
    return this.getLatestCertificateFileByUserId(userId);
  }

  async getLatestCertificateFileByUserId(userId: string): Promise<{
    filePath: string;
    downloadName: string;
  }> {
    const cert = await this.bankCertificateRepo.findOne({
      where: { user_id: userId } as any,
      order: { created_at: 'DESC' as any },
    });

    if (!cert) {
      throw new NotFoundException('No bank certificate found for this user');
    }

    const filePath = String((cert as any).file_path ?? '').trim();
    if (!filePath || !fs.existsSync(filePath)) {
      throw new NotFoundException('Bank certificate file not found on disk');
    }

    const downloadName = path.basename(filePath);
    console.log(
      `[contracts] Download certificate user=${userId} file=${downloadName}`,
    );

    return { filePath, downloadName };
  }

  // =========================
  // Public API (existing)
  // =========================

  async generateContractFromToken(token: string): Promise<Buffer> {
    console.log('[contracts-service] JWT_SECRET loaded?:', process.env.JWT_SECRET);

    const userId = this.getUserIdFromToken(token);
    return this.generateContractByUserId(userId);
  }

  async generateContractByUserId(userId: string): Promise<Buffer> {
    const contract = await this.contractRepo.findOne({
      where: { userId } as any,
      order: { createdAt: 'DESC' as any },
    });

    if (!contract) throw new NotFoundException('No contract found for user');

    const user = await this.userRepo.findOne({
      where: { id: userId } as any,
    });

    if (!user) throw new NotFoundException('User not found');

    const studentFullName = `${this.safe((user as any).firstName)} ${this.safe(
      (user as any).lastName,
    )}`.trim();
    const studentId = this.safe((user as any).identification);

    const scholar = await this.scholarRepo.findOne({
      where: { id: userId } as any,
    });

    let facultyName = 'PENDIENTE_DB';
    let careerName = 'PENDIENTE_DB';

    if (scholar) {
      if ((scholar as any).facultyId) {
        const faculty = await this.facultyRepo.findOne({
          where: { id: (scholar as any).facultyId } as any,
        });
        facultyName = this.safe((faculty as any)?.name);
      }

      if ((scholar as any).careerId) {
        const career = await this.careerRepo.findOne({
          where: { id: (scholar as any).careerId } as any,
        });
        careerName = this.safe((career as any)?.name);
      }
    }

    const bankAccount = await this.bankAccountRepo.findOne({
      where: { userId } as any,
    });

    let bankName = 'PENDIENTE_DB';
    let accountType = 'PENDIENTE_DB';
    let accountNumber = 'PENDIENTE_DB';
    let holderName = studentFullName || 'PENDIENTE_DB';

    if (bankAccount) {
      accountType = this.safe(bankAccount.accountType);
      accountNumber = this.safe(bankAccount.accountNumber);
      holderName = this.safe(bankAccount.holderName, holderName);

      if (bankAccount.bankId) {
        const bank = await this.bankRepo.findOne({
          where: { id: bankAccount.bankId } as any,
        });
        bankName = this.safe((bank as any)?.name);
      }
    }

    const contractData = {
      academic_period: this.formatAcademicPeriod(
        (contract as any).academicPeriodStart,
        (contract as any).academicPeriodEnd,
      ),
      contract_number: this.safe((contract as any).officialNumber),
      scholarship_amount: this.safe((contract as any).scholarshipAmount),
      contract_date: this.formatContractDate((contract as any).createdAt),

      student_full_name: this.safe(studentFullName),
      student_id: this.safe(studentId),

      faculty: this.safe(facultyName),
      career: this.safe(careerName),

      bank_name: this.safe(bankName),
      bank_account_type: this.safe(accountType),
      bank_account: this.safe(accountNumber),
      holder_name: this.safe(holderName),
    };

    const logoPath = path.join(process.cwd(), 'src', 'assets', 'logouce.png');
    const logoBase64 = fs.readFileSync(logoPath, 'base64');

    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'scholarship-contract.hbs',
    );
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(htmlTemplate);

    const html = template({
      ...contractData,
      logo: `data:image/png;base64,${logoBase64}`,
    });

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (err) {
      console.error('🔥 PUPPETEER LAUNCH ERROR:', err);
      throw err;
    }


    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      return Buffer.from(pdfUint8Array);
    } finally {
      await browser.close();
    }
  }


  async finalizeContractFromToken(token: string, dto: FinalizeContractDto) {
    const userId = this.getUserIdFromToken(token);

    if (!dto?.signatureHash || String(dto.signatureHash).trim().length < 16) {
      throw new BadRequestException('signatureHash is required');
    }

    // 1) Find target contract: explicit contractId OR latest by user
    const contract = dto.contractId
      ? await this.contractRepo.findOne({ where: { id: dto.contractId } as any })
      : await this.contractRepo.findOne({
        where: { userId } as any,
        order: { createdAt: 'DESC' as any },
      });

    if (!contract) {
      throw new NotFoundException('No contract found to finalize');
    }

    // Optional: ensure the contract belongs to the same user (if contractId was provided)
    if ((contract as any).userId && String((contract as any).userId) !== String(userId)) {
      throw new UnauthorizedException('You cannot finalize a contract that is not yours');
    }

    // 2) Generate final PDF buffer (same generator used for preview)
    const pdfBuffer = await this.generateContractByUserId(userId);

    // 3) Store PDF + set signed status + store "blockchain hash" (mock = signature hash)
    (contract as any).file = pdfBuffer;
    (contract as any).status = 'signed';
    (contract as any).blockchainHash = String(dto.signatureHash).trim();

    const saved = await this.contractRepo.save(contract);

    console.log(
      `[contracts] Contract finalized. user=${userId} contractId=${saved.id} status=${saved.status} storedBytes=${pdfBuffer.length} blockchainHash=${(saved as any).blockchainHash}`,
    );

    // ⬅️ NUEVO EVENTO
    await this.eventProducer.emit(Topics.CONTRACT_GENERATED, {
      contractId: String(saved.id),
      userId: String(userId),
      status: String(saved.status),
      blockchainHash: String(saved.blockchainHash),
      storedBytes: pdfBuffer.length,
      timestamp: Date.now(),
    });

    console.log('[contracts] 📤 CONTRACT_GENERATED event emitted');

    return {
      ok: true,
      contractId: String(saved.id),
      status: String((saved as any).status),
      storedBytes: pdfBuffer.length,
      blockchainHash: String((saved as any).blockchainHash),
    };
  }


}
