import {Request, Response, NextFunction} from "express";
import {Result, validationResult, ValidationError} from "express-validator";
import {HTTP_STATUS} from "../enums/http-status";

export type ErrorType = {
    message: string;
    field: string;
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);

    if (!result.isEmpty()) {
        const errors: ErrorType[] = result.formatWith((error: ValidationError) => ({
            message: error.msg as string,
            field: (error as any).path as string || (error as any).param,
        })).array({onlyFirstError: true});

        return res.status(HTTP_STATUS.BAD_REQUEST_400).json({errorsMessages: errors});
    }

    next();
}