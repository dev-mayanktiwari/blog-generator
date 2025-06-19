import { Router } from "express";
import healthController from "../controllers/healthController";

const healthRouter: Router = Router();

healthRouter.get("/", healthController.health);
healthRouter.get("/self", healthController.self);

export default healthRouter;
