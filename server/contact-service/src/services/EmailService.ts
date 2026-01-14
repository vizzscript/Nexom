import sgMail from "@sendgrid/mail";
import config from "../config/config";

if (config.sendgridApiKey) {
    sgMail.setApiKey(config.sendgridApiKey);
}

export const sendContactEmail = async (data: { firstName: string, lastName: string, email: string, phone: string, subject: string, message: string }) => {
    try {
        if (!config.sendgridApiKey) {
            console.warn("SendGrid API Key is missing. Contact email not sent.");
            return;
        }

        const msg = {
            to: config.adminEmail || "admin@nexom.com",
            from: config.smtp.user || "support@nexom.com", // Must be a verified sender
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

        const response = await sgMail.send(msg);
        console.log("Contact email sent successfully via SendGrid");
        return response;
    } catch (error: any) {
        console.error("Error sending contact email via SendGrid: ", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error("Failed to send contact email");
    }
};

export const sendAutoReplyEmail = async (data: { firstName: string, email: string }) => {
    try {
        if (!config.sendgridApiKey) return;

        const msg = {
            to: data.email,
            from: config.smtp.user || "support@nexom.com",
            subject: "We received your message",
            html: `
                <h3>Hi ${data.firstName},</h3>
                <p>Thank you for reaching out to Nexom. We have received your message and our support team will get back to you shortly.</p>
                <p>Best regards,<br/>The Nexom Team</p>
            `,
        };

        const response = await sgMail.send(msg);
        console.log("Auto-reply email sent successfully via SendGrid");
        return response;
    } catch (error: any) {
        console.error("Error sending auto-reply email via SendGrid: ", error);
    }
};

export default {
    sendContactEmail,
    sendAutoReplyEmail
};
