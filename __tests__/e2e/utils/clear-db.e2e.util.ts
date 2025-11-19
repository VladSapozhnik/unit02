import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { Express } from 'express';
import request, { Response } from 'supertest';

export const clearDbE2eUtil = async (app: Express): Promise<Response> => {
  return await request(app)
    .delete(RouterPathConst.__tests__)
    .expect(HTTP_STATUS.NO_CONTENT_204);
};
