import { Router } from "express";
import categoryController from "../controllers/category.controller"; // Import the category controller
import { authenticate, requireAdmin } from "../middleware";

const categoryRouter = Router();

// Apply authentication middleware to all category routes
// categoryRouter.use(authenticate);

// Public read endpoints
categoryRouter.get("/", categoryController.getAll);
categoryRouter.get("/:id", categoryController.getOne);

// Admin endpoints
categoryRouter.post("/", authenticate, requireAdmin, categoryController.create);
categoryRouter.patch("/:id", authenticate, requireAdmin, categoryController.update);
categoryRouter.delete("/:id", authenticate, requireAdmin, categoryController.delete);


export default categoryRouter;
