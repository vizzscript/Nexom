// src/controllers/ContactController.ts
import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage"; // Ensure you create this model
// import EmailService from "../services/EmailService";

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const requester = req.user;
        const { firstName, lastName, email, phone, subject, message } = req.body;

        if (!requester?.subject) {
            return res.status(401).json({ status: 401, message: "Authentication required." });
        }

        if (!firstName || !email || !message) {
            return res.status(400).json({ status: 400, message: "Required fields missing." });
        }

        // B2C Industrial Requirement: Standardized notification content
        const notificationTitle = `Thank you, ${firstName}!`;
        const notificationBody = "We have received your message and added it to our support queue.";

        // 1. Save to DB - Include notification fields for persistence
        const newMessage = await ContactMessage.create({
            firstName,
            lastName,
            email: requester.email || email,
            phone,
            subject,
            message,
            notificationTitle,
            notificationBody,
            userId: requester.subject,
            status: 'pending'
        });

        // 2. Return ONLY the status and notification object to the frontend
        return res.status(200).json({
            status: 200,
            message: "Success",
            notification: {
                title: notificationTitle,
                body: notificationBody,
                timestamp: newMessage.createdAt,
                referenceId: newMessage._id,
                status: newMessage.status
            }
        });
    } catch (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ status: 500, message: "Server error." });
    }
};

// GET all messages for the Admin Panel
export const fetchMessages = async (req: Request, res: Response) => {
    try {
        const requester = req.user;
        if (!requester?.subject) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const query = requester.role === "admin" ? {} : { userId: requester.subject };
        const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
};

// PATCH to mark a message as read
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const requester = req.user;
        if (!requester?.subject) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { id } = req.params;
        const existingMessage = await ContactMessage.findById(id);
        if (!existingMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (requester.role !== "admin" && existingMessage.userId !== requester.subject) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const message = await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        return res.status(200).json({ message: "Marked as read", data: message });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update status" });
    }
};

// DELETE a message
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const requester = req.user;
        if (!requester?.subject) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { id } = req.params;
        const existingMessage = await ContactMessage.findById(id);
        if (!existingMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (requester.role !== "admin" && existingMessage.userId !== requester.subject) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const message = await ContactMessage.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete message" });
    }
};

// Export all as a default object to satisfy the route import
const ContactController = {
    submitContactForm,
    fetchMessages,
    markAsRead,
    deleteMessage
};

export default ContactController;
