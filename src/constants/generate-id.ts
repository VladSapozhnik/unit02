import { webcrypto } from 'node:crypto';

export const generateId= () => webcrypto.randomUUID();
