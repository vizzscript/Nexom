import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import User from "../database/models/UserModel";
import EmailService from "../services/EmailService";
import { ApiError } from "../utils";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90;

const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true
};


// ---------------------------------------------
// JWT TOKEN CREATOR
// ---------------------------------------------
const createSendToken = (user: any, res: Response) => {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        jwtSecret,
        { expiresIn: "15m" }
    );

    if (config.env === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    return token;
}

// ---------------------------------------------
// GENERATE OTP
// ---------------------------------------------
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();



// ---------------------------------------------
// SEND OTP
// ---------------------------------------------
export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) throw new ApiError(400, "Email is required!");

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                otp: null,
                otpExpiresAt: null
            })
        }

        const otp = generateOtp();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        user.otp = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Otp valid for 5 min
        await user.save();

        // Send Email
        await EmailService.sendOtpEmail(email, otp);

        return res.status(200).json({
            status: 200,
            message: "OTP sent successfully.",
        });
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: statusCode,
            message: error.message
        })
    }
}



// ---------------------------------------------
// RESEND OTP
// ---------------------------------------------
export const resendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) throw new ApiError(400, "Email is required!");

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User does not exist.");
        }

        // RATE LIMIT: allow resend only after 60 seconds
        const lastOtpSentAt = (user as any).lastOtpSentAt as Date | undefined;
        if (lastOtpSentAt) {
            const timeDiff = Date.now() - lastOtpSentAt.getTime();
            if (timeDiff < 60 * 1000) {
                const wait = Math.ceil((60 * 1000 - timeDiff) / 1000);
                throw new ApiError(429, `Please wait ${wait} seconds before resending OTP.`);
            }
        }

        // generate new OTP and save
        const otp = generateOtp();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        user.otp = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Otp valid for 5 min
        (user as any).lastOtpSentAt = new Date();
        await user.save();

        // send Email
        await EmailService.sendOtpEmail(email, otp);

        return res.status(200).json({
            status: 200,
            message: "OTP resent successfully."
        });
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: statusCode,
            message: error.message
        })
    }
}


// ---------------------------------------------
// VERIFY OTP
// ---------------------------------------------
export const verifyOtp = async (req: Request, res: Response) => {
    try {
        console.log("Body: ", req.body);
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ApiError(400, "Email and OTP are required!");
        }

        const user = await User.findOne({ email }).select("+otp +otpExpiresAt");
        if (!user) throw new ApiError(404, "User does not exist");

        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        const isValidOtp = user.otp === hashedOtp && user.otpExpiresAt && user.otpExpiresAt > new Date();

        if (!isValidOtp) {
            throw new ApiError(400, "Invalid or expired OTP");
        }

        // Reset OTP so it can't be reused
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        const token = createSendToken(user, res);

        return res.status(200).json({
            status: 200,
            message: "Logged in successfully!",
            token
        })
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: statusCode,
            message: error.message
        })
    }
}

export default {
    sendOtp,
    resendOtp,
    verifyOtp
}