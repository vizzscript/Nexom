import { Router } from "express";
import ContactController from "../controllers/ContactController";

const router = Router();

router.post("/submit", ContactController.submitContactForm);
router.get("/messages", ContactController.fetchMessages);
router.patch("/messages/:id/read", ContactController.markAsRead);
router.delete("/messages/:id", ContactController.deleteMessage);

export default router;