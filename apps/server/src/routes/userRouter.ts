import { Router } from "express";
import userController from "../controllers/authController";

const userRouter: Router = Router();

userRouter.post("/register", userController.register);

export default userRouter;
