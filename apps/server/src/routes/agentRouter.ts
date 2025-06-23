import { Router } from "express";
import agentController from "../controllers/agentController";

const agentRouter: Router = Router();

agentRouter.get("/generate-blog", agentController.getGeneratedBlog);

export default agentRouter;
