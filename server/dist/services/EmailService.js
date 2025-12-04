"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.smtp.host,
    port: Number(config_1.default.smtp.port),
    secure: false, // true for 465, false for other ports
    auth: {
        user: config_1.default.smtp.user,
        pass: config_1.default.smtp.pass,
    },
});
const sendOtpEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: `"Hoora App" <${config_1.default.smtp.user}>`,
            to: email,
            subject: "Your OTP for Hoora App",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;
    }
    catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send OTP email");
    }
});
exports.sendOtpEmail = sendOtpEmail;
exports.default = {
    sendOtpEmail: exports.sendOtpEmail
};
