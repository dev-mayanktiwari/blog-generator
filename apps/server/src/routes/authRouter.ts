import { Router } from "express";
import authController from "../controllers/authController";
import { authMiddleware } from "@workspace/auth";

const authRouter: Router = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.me);

export default authRouter;
