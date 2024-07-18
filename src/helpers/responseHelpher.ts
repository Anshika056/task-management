import { Response } from "express";

interface ResponseParams {
    res: Response;
    code: number;
    success: boolean;
    message: string;
    data: any;
}

interface ErrorResponseParams {
    res: Response;
    err: any;
    code?: number;
    message?: string;
}

const response = ({ res, code, success, message, data }: ResponseParams) => {
    return res.status(code).json({
        success,
        message,
        data
    });
};

const error = ({ res, err, code = 500, message = "Internal Server Error" }: ErrorResponseParams) => {
    console.error(err); // Log the error for debugging
    return res.status(code).json({
        success: false,
        message,
        error: err.message || err
    });
};

export default {
    response,
    error
};
