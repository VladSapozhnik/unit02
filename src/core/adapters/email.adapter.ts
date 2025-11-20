import nodemailer from 'nodemailer';
import { settings } from '../settings/settings';

export const emailAdapter = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: settings.USER_GMAIL,
        pass: settings.USER_GMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `Vlad Mirage <${settings.USER_GMAIL}>`,
        to: email,
        subject: 'Code registration my sait',
        html: template(code),
      });
    } catch (e) {
      console.log('Send email error' + e);
    }

    return true;
  },
};
