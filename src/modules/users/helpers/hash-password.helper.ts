import bcrypt from 'bcrypt';

export const hashPasswordHelper = async (
  password: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};
