import sgMail from "@sendgrid/mail";
import config from "../config/config";

if (config.sendgridApiKey) {
    sgMail.setApiKey(config.sendgridApiKey);
}

export const sendOtpEmail = async (email: string, otp: string) => {
    try {
        if (!config.sendgridApiKey) {
            console.warn("SendGrid API Key is missing. Email not sent.");
            return;
        }

        const msg = {
            to: email,
            from: config.smtp.user || "support@nexom.com", // Must be a verified sender in SendGrid
            subject: "Your OTP for Nexom App",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };

        const response = await sgMail.send(msg);
        console.log("OTP Email sent successfully via SendGrid");
        return response;
    } catch (error: any) {
        console.error("Error sending email via SendGrid: ", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error("Failed to send OTP email");
    }
};

export default {
    sendOtpEmail
};
