import { Router } from "express";
import AuthController from "../controllers/AuthController";

const userRouter = Router();

userRouter.post("/send-otp", AuthController.sendOtp);
userRouter.post("/verify-otp", AuthController.verifyOtp);
userRouter.post("/resend-otp", AuthController.resendOtp);

export default userRouter;