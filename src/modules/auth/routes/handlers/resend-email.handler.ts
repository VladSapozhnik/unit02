// import { Response } from 'express';
// import { authService } from '../../application/auth.service';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { RequestWithBody } from '../../../../core/types/request.type';
// import { ResendEmailDto } from '../../dto/resend-email.dto';
// import { ResultStatus } from '../../../../core/enums/result-status.enum';
//
// export const resendEmailHandler = async (
//   req: RequestWithBody<ResendEmailDto>,
//   res: Response,
// ) => {
//   const { status, extensions } = await authService.resendEmail(req.body.email);
//
//   if (status === ResultStatus.BadRequest) {
//     res.sendStatus(400).json(extensions);
//     return;
//   }
//
//   res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
// };
