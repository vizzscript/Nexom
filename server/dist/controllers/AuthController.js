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
exports.verifyOtp = exports.resendOtp = exports.sendOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const database_1 = require("../database");
const EmailService_1 = __importDefault(require("../services/EmailService"));
const utils_1 = require("../utils");
const jwtSecret = config_1.default.JWT_SECRET;
const COOKIE_EXPIRATION_DAYS = 90;
const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true
};
// ---------------------------------------------
// JWT TOKEN CREATOR
// ---------------------------------------------
const createSendToken = (user, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: "1d" });
    if (config_1.default.env === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    return token;
};
// ---------------------------------------------
// GENERATE OTP
// ---------------------------------------------
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
// ---------------------------------------------
// SEND OTP
// ---------------------------------------------
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            throw new utils_1.ApiError(400, "Email is required!");
        let user = yield database_1.User.findOne({ email });
        if (!user) {
            user = yield database_1.User.create({
                email,
                otp: null,
                otpExpiresAt: null
            });
        }
        const otp = generateOtp();
        const hashedOtp = crypto_1.default.createHash("sha256").update(otp).digest("hex");
        user.otp = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Otp valid for 5 min
        yield user.save();
        // Send Email
        yield EmailService_1.default.sendOtpEmail(email, otp);
        return res.json({
            status: 200,
            message: "OTP sent successfully.",
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            message: error.message
        });
    }
});
exports.sendOtp = sendOtp;
// ---------------------------------------------
// RESEND OTP
// ---------------------------------------------
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            throw new utils_1.ApiError(400, "Email is required!");
        const user = yield database_1.User.findOne({ email });
        if (!user) {
            throw new utils_1.ApiError(404, "User does not exist.");
        }
        // RATE LIMIT: allow resend only after 60 seconds
        const lastOtpSentAt = user.lastOtpSentAt;
        if (lastOtpSentAt) {
            const timeDiff = Date.now() - lastOtpSentAt.getTime();
            if (timeDiff < 60 * 1000) {
                const wait = Math.ceil((60 * 1000 - timeDiff) / 1000);
                throw new utils_1.ApiError(429, `Please wait ${wait} seconds before resending OTP.`);
            }
        }
        // generate new OTP and save
        const otp = generateOtp();
        const hashedOtp = crypto_1.default.createHash("sha256").update(otp).digest("hex");
        user.otp = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Otp valid for 5 min
        user.lastOtpSentAt = new Date();
        yield user.save();
        // send Email
        yield EmailService_1.default.sendOtpEmail(email, otp);
        return res.json({
            status: 200,
            message: "OTP resent successfully."
        });
    }
    catch (error) {
        return res.json({
            status: error.status || 500,
            message: error.message
        });
    }
});
exports.resendOtp = resendOtp;
// ---------------------------------------------
// VERIFY OTP
// ---------------------------------------------
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new utils_1.ApiError(400, "Email and OTP are required!");
        }
        const user = yield database_1.User.findOne({ email }).select("+otp +otpExpiresAt");
        if (!user)
            throw new utils_1.ApiError(404, "User does not exist");
        const hashedOtp = crypto_1.default.createHash("sha256").update(otp).digest("hex");
        const isValidOtp = user.otp === hashedOtp && user.otpExpiresAt && user.otpExpiresAt > new Date();
        if (!isValidOtp) {
            throw new utils_1.ApiError(400, "Invalid or expired OTP");
        }
        // Reset OTP so it can't be reused
        user.otp = null;
        user.otpExpiresAt = null;
        yield user.save();
        const token = createSendToken(user, res);
        return res.json({
            status: 200,
            message: "Logged in successfully!",
            token
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            message: error.message
        });
    }
});
exports.verifyOtp = verifyOtp;
exports.default = {
    sendOtp: exports.sendOtp,
    resendOtp: exports.resendOtp,
    verifyOtp: exports.verifyOtp
};
