import { emailAdapter } from '../adapters/email.adapter';

export const emailManager = {
  async sendEmailForRegistration(email: string, code: string): Promise<void> {
    await emailAdapter.send(
      email,
      ` <h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
             </p>`,
    );
  },
};
