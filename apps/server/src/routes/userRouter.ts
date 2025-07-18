import { Router } from "express";
import userController from "../controllers/userController";

const userRouter: Router = Router();

userRouter.post("/generate-blog", userController.generatePost);
userRouter.get("/get-user-posts", userController.getUserPosts);

// Dummy route for testing purposes
userRouter.post("/dummy-generation", userController.dummyGeneration);

export default userRouter;
