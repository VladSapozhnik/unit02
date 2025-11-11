import { Request } from 'express';

export interface RequestWithUserId<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
}
export type RequestUserIdWithBody<T> = RequestWithUserId<{}, {}, T>;
export type RequestUserIdWithQuery<T> = RequestWithUserId<{}, {}, {}, T>;
export type RequestUserIdParam<T> = RequestWithUserId<T>;
export type RequestUserIdWithParamAndQuery<T, T2> = RequestWithUserId<
  T,
  {},
  {},
  T2
>;
export type RequestUserIdWithParamAndBody<T, T2> = RequestWithUserId<T, {}, T2>;
