import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { LoginDto } from '../../dto/login.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { AccessTokenType } from '../../type/access-token.type';
import { Result } from '../../../../core/types/result.type';

export const loginHandler = async (
  req: RequestWithBody<LoginDto>,
  res: Response<Result<AccessTokenType | null>>,
) => {
  const date: Result<AccessTokenType | null> = await authService.login(
    req.body,
  );
  res.json(date);
};
