import {Request} from 'express';

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParam<T> = Request<T>
export type RequestWithParamAndBody<T, T2> = Request<T, {}, T2>