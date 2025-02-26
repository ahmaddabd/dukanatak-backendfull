import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: true,
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get("SMTP_FROM"),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = "مرحباً بك في تطبيقنا";
    const html = `
      <h1>مرحباً ${name}!</h1>
      <p>نحن سعداء بانضمامك إلينا.</p>
      <p>نتمنى لك تجربة ممتعة.</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const subject = "إعادة تعيين كلمة المرور";
    const resetLink = `${this.configService.get(
      "APP_URL"
    )}/reset-password?token=${resetToken}`;
    const html = `
      <h1>إعادة تعيين كلمة المرور</h1>
      <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
      <p>يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:</p>
      <a href="${resetLink}">إعادة تعيين كلمة المرور</a>
    `;
    await this.sendEmail(to, subject, html);
  }
}
