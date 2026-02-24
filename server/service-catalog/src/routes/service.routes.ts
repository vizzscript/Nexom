import { Router } from "express";
import serviceController from "../controllers/service.controller";
import { authenticate, requireAdmin } from "../middleware";

const serviceRouter = Router();

// Apply authentication middleware to all service routes (e.g., requires login)
// serviceRouter.use(authenticate);

// Public read endpoints
serviceRouter.get("/", serviceController.getAll);
serviceRouter.get("/:id", serviceController.getOne);

// Admin endpoints
serviceRouter.post("/bulk", authenticate, requireAdmin, serviceController.bulkCreate);
serviceRouter.post("/", authenticate, requireAdmin, serviceController.create);
serviceRouter.patch("/:id", authenticate, requireAdmin, serviceController.update);
serviceRouter.delete("/:id", authenticate, requireAdmin, serviceController.delete);


export default serviceRouter;
