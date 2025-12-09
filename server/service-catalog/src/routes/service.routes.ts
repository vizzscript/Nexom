import { Router } from "express";
import serviceController from "../controllers/service.controller";
// import { authenticate } from "../middleware"; // Assuming this path is correct

const serviceRouter = Router();

// Apply authentication middleware to all service routes (e.g., requires login)
// serviceRouter.use(authenticate);

// BULK CREATE ROUTE (POST /api/services/bulk)
serviceRouter.post("/bulk", serviceController.bulkCreate);

// CRUD Endpoints for Services
serviceRouter.post("/", serviceController.create);             // Create a new service
serviceRouter.get("/", serviceController.getAll);              // Get all services
serviceRouter.get("/:id", serviceController.getOne);           // Get service by ID
serviceRouter.patch("/:id", serviceController.update);         // Update service by ID
serviceRouter.delete("/:id", serviceController.delete);         // Delete service by ID


export default serviceRouter;