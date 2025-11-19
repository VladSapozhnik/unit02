import nodemailer from 'nodemailer';
import { settings } from '../settings/settings';

export const emailAdapter = {
  async sendEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: settings.USER_GMAIL,
        pass: settings.USER_GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Vlad Mirage <${settings.USER_GMAIL}>`,
      to: email,
      subject: 'Code registration my sait',
      html: ` <h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
             </p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log('Send email error' + e);
    }

    return true;
  },
};
