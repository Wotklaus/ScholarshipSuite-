import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });

    this.logger.log(`📧 Email enviado → ${to}`);
  }
}
