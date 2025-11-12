import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { LoginDto } from '../../dto/login.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { AccessTokenType } from '../../type/access-token.type';
import { jwtService } from '../../../../core/jwt/jwt.service';

export const loginHandler = async (
  req: RequestWithBody<LoginDto>,
  res: Response<AccessTokenType>,
) => {
  const isLogin: false | string = await authService.login(req.body);

  if (!isLogin) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }
  const jwt: string = await jwtService.createAccessToken(isLogin);

  res.json({
    accessToken: jwt,
  });
};
