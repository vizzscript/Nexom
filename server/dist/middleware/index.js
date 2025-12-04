"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const utils_1 = require("../utils");
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof utils_1.ApiError)) {
        const statusCode = error.statusCode || (error instanceof Error ? 400 : 500);
        const message = error.message || (statusCode === 400 ? "Bad Request" : "Internal Server Error");
        error = new utils_1.ApiError(statusCode, message, false, err.stack.toString());
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        statusCode = 500;
        message = "Internal Server Error";
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ code: statusCode, message }, (process.env.NODE_ENV === "development" && { stack: err.stack }));
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }
    res.status(statusCode).json(response);
    next();
};
exports.errorHandler = errorHandler;
