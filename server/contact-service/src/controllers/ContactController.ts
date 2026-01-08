import { Request, Response } from "express";
import EmailService from "../services/EmailService";

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        // Basic validation
        if (!firstName || !email || !message) {
            return res.status(400).json({
                status: 400,
                message: "First name, email, and message are required."
            });
        }

        // Send email to admin
        await EmailService.sendContactEmail({
            firstName,
            lastName,
            email,
            phone,
            subject,
            message
        });

        // Send auto-reply to user
        await EmailService.sendAutoReplyEmail({
            firstName,
            email
        });

        return res.status(200).json({
            status: 200,
            message: "Message sent successfully."
        });
    } catch (error: any) {
        console.error("Contact form error:", error);
        return res.status(500).json({
            status: 500,
            message: "Failed to process your request."
        });
    }
};

export default {
    submitContactForm
};
