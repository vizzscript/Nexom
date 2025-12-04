"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const userRouter = (0, express_1.Router)();
userRouter.post("/send-otp", AuthController_1.default.sendOtp);
userRouter.post("/verify-otp", AuthController_1.default.verifyOtp);
userRouter.post("/resend-otp", AuthController_1.default.resendOtp);
exports.default = userRouter;
