import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    host: config.smtp.host || "smtp.gmail.com",
    port: parseInt(config.smtp.port || "465"),
    secure: true, // true for 465, false for other ports
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
    tls: {
        rejectUnauthorized: false
    },
    // Force IPv4 to avoid IPv6 timeout issues on some cloud providers
    family: 4
} as nodemailer.TransportOptions);

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Connection Error:", error);
        console.error("SMTP Config:", {
            host: config.smtp.host || "smtp.gmail.com",
            port: config.smtp.port || "465",
            user: config.smtp.user,
            pass: config.smtp.pass ? "****" : "MISSING"
        });
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
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
