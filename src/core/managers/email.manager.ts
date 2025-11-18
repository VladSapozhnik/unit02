import { emailAdapter } from '../adapters/email.adapter';

export const emailManager = {
  async sendEmailForRegistration(email: string, code: string): Promise<void> {
    await emailAdapter.send(
      email,
      `<div>
                <h1>HI MAN, YO</h1>
                <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </div>`,
    );
  },
};
