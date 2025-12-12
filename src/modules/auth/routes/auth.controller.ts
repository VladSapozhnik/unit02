import { inject, injectable } from 'inversify';
import { RequestWithBody } from '../../../core/types/request.type';
import { ConfirmEmailDto } from '../dto/confirm-email.dto';
import { Request, Response } from 'express';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { ProfileType } from '../../users/type/profile.type';
import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { LoginDto } from '../dto/login.dto';
import { AccessTokenType } from '../type/access-token.type';
import { cookieAdapter } from '../../../core/adapters/cookie.adapter';
import { Result } from '../../../core/types/result.type';
import { AccessAndRefreshTokensType } from '../type/access-and-refresh-tokens.type';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { AuthService } from '../application/auth.service';
import { UsersQueryRepository } from '../../users/repositories/users.query.repository';
import { PasswordRecoveryDto } from '../dto/password-recovery.dto';
import { NewPasswordDto } from '../dto/new-password.dto';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async confirmEmail(req: RequestWithBody<ConfirmEmailDto>, res: Response) {
    const { status, extensions } = await this.authService.confirmEmail(
      req.body.code,
    );

    if (status === ResultStatus.BadRequest) {
      res.sendStatus(400).json(extensions);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async getProfile(req: Request, res: Response) {
    const userId: string = req.userId as string;

    const getProfile: ProfileType | null =
      await this.usersQueryRepository.getProfile(userId);

    if (!getProfile) {
      throw new UnauthorizedError('User not found', 'profile');
    }
    res.json(getProfile);
  }

  async login(req: RequestWithBody<LoginDto>, res: Response<AccessTokenType>) {
    const clientIp: string = req.ip ?? 'unknown';
    const userAgentString: string = req.headers['user-agent'] ?? 'unknown';

    const { accessToken, refreshToken } = await this.authService.login(
      req.body,
      clientIp,
      userAgentString,
    );

    cookieAdapter.setRefreshCookie(res, refreshToken);

    res.json({
      accessToken: accessToken,
    });
  }

  async logout(req: Request, res: Response) {
    const oldRefreshToken = req.cookies.refreshToken as string;

    await this.authService.logout(oldRefreshToken);

    cookieAdapter.clearRefreshCookie(res);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async refreshToken(req: Request, res: Response) {
    const oldRefreshToken: string = req.cookies.refreshToken;

    const clientIp: string = req.ip ?? 'unknown';
    const userAgentString: string = req.headers['user-agent'] ?? 'unknown';

    const result: Result<AccessAndRefreshTokensType | null> =
      await this.authService.refreshToken(
        oldRefreshToken,
        clientIp,
        userAgentString,
      );

    if (result.status === ResultStatus.Unauthorized || result.data === null) {
      res.status(401).json(result.extensions);
      return;
    }

    const { accessToken, refreshToken } = result.data;

    cookieAdapter.setRefreshCookie(res, refreshToken);

    res.json({ accessToken });
  }

  async registerUser(req: Request, res: Response) {
    const { status, extensions } = await this.authService.registration(
      req.body,
    );

    if (status === ResultStatus.BadRequest) {
      res.sendStatus(400).json(extensions);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async resendEmail(req: RequestWithBody<ResendEmailDto>, res: Response) {
    const { status, extensions } = await this.authService.resendEmail(
      req.body.email,
    );

    if (status === ResultStatus.BadRequest) {
      res.sendStatus(400).json(extensions);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async passwordRecovery(
    req: RequestWithBody<PasswordRecoveryDto>,
    res: Response,
  ) {
    await this.authService.passwordRecovery(req.body.email);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async newPassword(req: RequestWithBody<NewPasswordDto>, res: Response) {
    const isNewPassword: Result = await this.authService.newPassword(
      req.body.newPassword,
      req.body.recoveryCode,
    );

    if (isNewPassword.status === ResultStatus.BadRequest) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json(isNewPassword.extensions);
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
