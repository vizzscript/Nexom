import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    host: config.smtp.host || "smtp.gmail.com",
    port: parseInt(config.smtp.port || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

export const sendContactEmail = async (data: { firstName: string, lastName: string, email: string, phone: string, subject: string, message: string }) => {
    try {
        if (!config.smtp.user || !config.smtp.pass) {
            console.warn("SMTP credentials are missing. Contact email not sent.");
            return;
        }

        const mailOptions = {
            from: config.smtp.user, // Gmail requires the sender to be the authenticated user
            to: config.adminEmail || config.smtp.user,
            replyTo: data.email,
            subject: `New Contact Message: ${data.subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Contact email sent successfully via Gmail SMTP:", info.messageId);
        return info;
    } catch (error: any) {
        console.error("Error sending contact email via Gmail SMTP: ", error);
        throw new Error("Failed to send contact email");
    }
};

export const sendAutoReplyEmail = async (data: { firstName: string, email: string }) => {
    try {
        if (!config.smtp.user || !config.smtp.pass) return;

        const mailOptions = {
            from: config.smtp.user,
            to: data.email,
            subject: "We received your message",
            html: `
                <h3>Hi ${data.firstName},</h3>
                <p>Thank you for reaching out to Nexom. We have received your message and our support team will get back to you shortly.</p>
                <p>Best regards,<br/>The Nexom Team</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Auto-reply email sent successfully via Gmail SMTP:", info.messageId);
        return info;
    } catch (error: any) {
        console.error("Error sending auto-reply email via Gmail SMTP: ", error);
    }
};

export default {
    sendContactEmail,
    sendAutoReplyEmail
};
