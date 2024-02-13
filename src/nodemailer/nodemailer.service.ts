import { Injectable } from '@nestjs/common';
import { Email } from '@prisma/client';
import { SentMessageInfo } from 'nodemailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  private sendEmail({ email, subject, html }): Promise<SentMessageInfo> {
    return this.transporter.sendMail({
      to: email,
      subject,
      html,
    });
  }

  async sendEmailWithRate(email: string, currentRate: number): Promise<void> {
    const normalizedRate = currentRate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const html = `
      Current Rate: ${normalizedRate} UAH
    `;

    await this.sendEmail({
      email,
      html,
      subject: 'BTC UAH Exchange Rate Update',
    });
  }

  async sendEmailToSubscribedUsers(
    currentRate: number,
    subscribedEmails: Email[],
  ): Promise<[string[], string[]]> {
    const errors = [];
    const sended = [];

    for (const { email } of subscribedEmails) {
      try {
        await this.sendEmailWithRate(email, currentRate);

        sended.push(email);
      } catch (error) {
        errors.push(email);

        continue;
      }
    }

    return [sended, errors];
  }
}
