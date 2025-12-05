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

console.log("Email Service Config:", {
    host: config.smtp.host,
    port: config.smtp.port,
    user: config.smtp.user,
    pass: config.smtp.pass ? "****" : undefined
});

export const sendOtpEmail = async (email: string, otp: string) => {
    try {
        const mailOptions = {
            from: `"Nexom App" <${config.smtp.user}>`,
            to: email,
            subject: "Your OTP for Nexom App",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send OTP email");
    }
};

export default {
    sendOtpEmail
};
