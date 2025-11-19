import * as argon2 from 'argon2';

export const hashAdapter = {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  },
  async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(password, hash);
  },
};
