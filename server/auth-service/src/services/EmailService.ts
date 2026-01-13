import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

export const sendOtpEmail = async (email: string, otp: string) => {
    try {
        if (!config.smtp.user || !config.smtp.pass) {
            console.warn("SMTP credentials are missing. Email not sent.");
            return;
        }

        const mailOptions = {
            from: config.smtp.user,
            to: email,
            subject: "Your OTP for Nexom App",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("OTP Email sent successfully via Gmail SMTP:", info.messageId);
        return info;
    } catch (error: any) {
        console.error("Error sending email via Gmail SMTP: ", error);
        throw new Error("Failed to send OTP email");
    }
};

export default {
    sendOtpEmail
};
