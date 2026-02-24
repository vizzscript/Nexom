import { Router } from "express";
import ContactController from "../controllers/ContactController";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/submit", authenticate, ContactController.submitContactForm);
router.get("/messages", authenticate, ContactController.fetchMessages);
router.patch("/messages/:id/read", authenticate, ContactController.markAsRead);
router.delete("/messages/:id", authenticate, ContactController.deleteMessage);

export default router;
