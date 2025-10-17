import { RouterPath } from '../../src/constants/router-path';
import { HTTP_STATUS } from '../../src/enums/http-status';
import { Express } from 'express';
import request, { Response } from 'supertest';

export const clearDbE2eUtil = async (app: Express): Promise<Response> => {
  return await request(app)
    .delete(RouterPath.__tests__)
    .expect(HTTP_STATUS.NO_CONTENT_204);
};
