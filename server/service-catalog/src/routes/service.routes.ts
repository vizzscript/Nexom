import { Router } from "express";
import serviceController from "../controllers/service.controller";
import { authenticate } from "../middleware";

const serviceRouter = Router();

// Apply authentication middleware to all routes
serviceRouter.use(authenticate);

serviceRouter.post("/", serviceController.create); // Admin
serviceRouter.get("/", serviceController.getAll); // Public
serviceRouter.get("/:id", serviceController.getOne); // Public
serviceRouter.delete("/:id", serviceController.delete); // Admin


export default serviceRouter;