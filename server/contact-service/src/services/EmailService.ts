import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: Number(config.smtp.port),
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

export const sendContactEmail = async (data: { firstName: string, lastName: string, email: string, phone: string, subject: string, message: string }) => {
    try {
        const mailOptions = {
            from: `"Nexom Contact Form" <${config.smtp.user}>`,
            to: config.adminEmail,
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
        console.log("Contact email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending contact email: ", error);
        throw new Error("Failed to send contact email");
    }
};

export const sendAutoReplyEmail = async (data: { firstName: string, email: string }) => {
    try {
        const mailOptions = {
            from: `"Nexom Support" <${config.smtp.user}>`,
            to: data.email,
            subject: "We received your message",
            html: `
                <h3>Hi ${data.firstName},</h3>
                <p>Thank you for reaching out to Nexom. We have received your message and our support team will get back to you shortly.</p>
                <p>Best regards,<br/>The Nexom Team</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Auto-reply email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending auto-reply email: ", error);
        // Don't throw here, as the main contact email might have succeeded
    }
};

export default {
    sendContactEmail,
    sendAutoReplyEmail
};
