import { Router } from "express";
import AuthController from "../controllers/AuthController";

const userRouter = Router();

userRouter.post("/firebase-login", AuthController.firebaseLogin);

export default userRouter;