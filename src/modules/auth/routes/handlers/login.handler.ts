import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { LoginDto } from '../../dto/login.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { AccessTokenType } from '../../type/access-token.type';
import { AccessAndRefreshTokensType } from '../../type/access-and-refresh-tokens.type';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';

export const loginHandler = async (
  req: RequestWithBody<LoginDto>,
  res: Response<AccessTokenType>,
) => {
  const date: AccessAndRefreshTokensType = await authService.login(req.body);

  cookieAdapter.setRefreshCookie(res, date.refreshToken);

  res.json({
    accessToken: date.accessToken,
  });
};
