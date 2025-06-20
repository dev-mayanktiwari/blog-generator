import { Router } from "express";
import agentController from "../controllers/agentController";

const agentRouter: Router = Router();

agentRouter.get("/get-transcript", agentController.getVideoTranscript);

export default agentRouter;
