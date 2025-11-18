import nodemailer from 'nodemailer';
import { settings } from '../settings/settings';

export const emailAdapter = {
  async send(email: string, text: string) {
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
      text,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log('Send email error' + e);
    }

    return true;
  },
};
