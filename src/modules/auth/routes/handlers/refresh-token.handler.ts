// import { Request, Response } from 'express';
// import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';
// import { authService } from '../../application/auth.service';
// import { Result } from '../../../../core/types/result.type';
// import { ResultStatus } from '../../../../core/enums/result-status.enum';
// import { AccessAndRefreshTokensType } from '../../type/access-and-refresh-tokens.type';
//
// export const refreshTokenHandler = async (req: Request, res: Response) => {
//   const oldRefreshToken: string = req.cookies.refreshToken;
//
//   const clientIp: string = req.ip ?? 'unknown';
//   const userAgentString: string = req.headers['user-agent'] ?? 'unknown';
//
//   const result: Result<AccessAndRefreshTokensType | null> =
//     await authService.refreshToken(oldRefreshToken, clientIp, userAgentString);
//
//   if (result.status === ResultStatus.Unauthorized || result.data === null) {
//     res.status(401).json(result.extensions);
//     return;
//   }
//
//   const { accessToken, refreshToken } = result.data;
//
//   cookieAdapter.setRefreshCookie(res, refreshToken);
//
//   res.json({ accessToken });
// };
