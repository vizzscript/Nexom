import { Router } from "express";
import ContactController from "../controllers/ContactController";

const router = Router();

router.post("/submit", ContactController.submitContactForm);

export default router;
