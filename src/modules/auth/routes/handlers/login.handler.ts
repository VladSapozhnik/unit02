import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { jwtService } from '../../../jwt/application/jwt.service';
import { ObjectId } from 'mongodb';
import { LoginResponse } from '../../dto/login.dto';

export const loginHandler = async (
  req: Request,
  res: Response<LoginResponse>,
) => {
  const isLogin: false | ObjectId = await authService.login(req.body);

  if (!isLogin) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }
  const jwt: string = await jwtService.createAccessToken(isLogin);
  res.json({
    accessToken: jwt,
  });
};
