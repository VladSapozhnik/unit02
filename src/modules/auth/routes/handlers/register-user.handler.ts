// import { Request, Response } from 'express';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { authService } from '../../application/auth.service';
// import { ResultStatus } from '../../../../core/enums/result-status.enum';
//
// export const registerUserHandler = async (req: Request, res: Response) => {
//   const { status, extensions } = await authService.registration(req.body);
//
//   if (status === ResultStatus.BadRequest) {
//     res.sendStatus(400).json(extensions);
//     return;
//   }
//
//   res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
// };
