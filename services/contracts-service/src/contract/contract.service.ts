import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { JwtService } from '@nestjs/jwt';

import { Contract } from './entities/contract.entity';
import { User } from './entities/user.entity';
import { Scholar } from './entities/scholar.entity';
import { Faculty } from './entities/faculty.entity';
import { Career } from './entities/career.entity';
import { BankAccount } from './entities/bank-account.entity';
import { Bank } from './entities/bank.entity';

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

    private readonly jwtService: JwtService,
  ) { }

  // =========================
  // Helpers
  // =========================

  private toDate(value: any): Date {
    if (!value) return new Date(NaN);
    if (value instanceof Date) return value;
    const d = new Date(value);
    return d;
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
    return `${this.monthUpperES(s)} ${s.getFullYear()} – ${this.monthUpperES(e)} ${e.getFullYear()}`;
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

  // =========================
  // Public API
  // =========================

  async generateContractFromToken(token: string): Promise<Buffer> {
    console.log('[contracts-service] JWT_SECRET loaded?:', process.env.JWT_SECRET);

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // tu token tiene id/email/role (según tu log)
    const userId = payload?.sub || payload?.id || payload?.userId;
    if (!userId) throw new UnauthorizedException('Token without user id');

    return this.generateContractByUserId(userId);
  }

  async generateContractByUserId(userId: string): Promise<Buffer> {
    // 1) Contrato (el último)
    const contract = await this.contractRepo.findOne({
      where: { userId } as any,
      order: { createdAt: 'DESC' as any },
    });

    if (!contract) throw new NotFoundException('No contract found for user');

    // 2) User (nombre + identificación)
    const user = await this.userRepo.findOne({
      where: { id: userId } as any,
    });

    if (!user) throw new NotFoundException('User not found');

    const studentFullName = `${this.safe((user as any).firstName)} ${this.safe((user as any).lastName)}`.trim();
    const studentId = this.safe((user as any).identification);

    // 3) Scholar (faculty_id + career_id)
    const scholar = await this.scholarRepo.findOne({
      where: { id: userId } as any, // en tu ER: scholars.id = users.id
    });

    // 4) Faculty + Career
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

    // 5) BankAccount (última) + Bank
    const bankAccount = await this.bankAccountRepo.findOne({
      where: { userId } as any,
    });


    let bankName = 'PENDIENTE_DB';
    let accountType = 'PENDIENTE_DB';
    let accountNumber = 'PENDIENTE_DB';
    let holderName = studentFullName || 'PENDIENTE_DB';

    if (bankAccount) {
      accountType = this.safe((bankAccount as any).accountType);
      accountNumber = this.safe((bankAccount as any).accountNumber);
      holderName = this.safe((bankAccount as any).holderName, holderName);

      const bankId = (bankAccount as any).bankId;
      if (bankId) {
        const bank = await this.bankRepo.findOne({
          where: { id: bankId } as any,
        });
        bankName = this.safe((bank as any)?.name);
      }
    }

    // 6) Data final para Handlebars (esto es lo que mata los PENDIENTE_DB)
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

    // 7) Logo
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'logouce.png');
    const logoBase64 = fs.readFileSync(logoPath, 'base64');

    // 8) Plantilla
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

    // 9) PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

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
}
