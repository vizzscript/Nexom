import { Router } from "express";
import categoryController from "../controllers/category.controller"; // Import the category controller
// import { authenticate } from "../middleware"; // Assuming this path is correct

const categoryRouter = Router();

// Apply authentication middleware to all category routes
// categoryRouter.use(authenticate);

// CRUD Endpoints for Categories
categoryRouter.post("/", categoryController.create);             // Create a new category
categoryRouter.get("/", categoryController.getAll);              // Get all categories
categoryRouter.get("/:id", categoryController.getOne);           // Get category by ID
categoryRouter.patch("/:id", categoryController.update);         // Update category by ID
categoryRouter.delete("/:id", categoryController.delete);         // Delete category by ID


export default categoryRouter;