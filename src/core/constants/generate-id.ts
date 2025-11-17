// import { webcrypto } from 'node:crypto';
//
// export const generateId = () => webcrypto.randomUUID();
import crypto from 'crypto';
export const generateId = () => crypto.randomUUID();
