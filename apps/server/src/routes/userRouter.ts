import { Router } from "express";
import userController from "../controllers/userController";

const userRouter: Router = Router();

userRouter.post("/generate-blog", userController.generatePost);
userRouter.get("/get-user-posts", userController.getUserPosts);

export default userRouter;
