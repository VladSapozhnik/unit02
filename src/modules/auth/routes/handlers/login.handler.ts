import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { LoginDto } from '../../dto/login.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { AccessTokenType } from '../../type/access-token.type';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';

export const loginHandler = async (
  req: RequestWithBody<LoginDto>,
  res: Response<AccessTokenType>,
) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  cookieAdapter.setRefreshCookie(res, refreshToken);

  res.json({
    accessToken: accessToken,
  });
};
