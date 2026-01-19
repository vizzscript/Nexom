import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import admin from "../config/firebaseAdmin";
import User from "../database/models/UserModel";
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
// FIREBASE LOGIN
// ---------------------------------------------
export const firebaseLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new ApiError(400, "Token is required!");
        }

        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        if (!email) {
            throw new ApiError(400, "Email is required from Firebase provider.");
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update user with firebase info if not present
            if (!user.firebaseUid) {
                user.firebaseUid = uid;
                if (name && !user.name) user.name = name;
                if (picture && !user.photoUrl) user.photoUrl = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                email,
                firebaseUid: uid,
                name: name || '',
                photoUrl: picture || ''
            });
        }

        // Generate App JWT
        const appToken = createSendToken(user, res);

        return res.status(200).json({
            status: 200,
            message: "Logged in successfully!",
            token: appToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                photoUrl: user.photoUrl,
                firebaseUid: uid
            }
        });

    } catch (error: any) {
        console.error("Firebase Login Error:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: statusCode,
            message: error.message || "Authentication failed"
        });
    }
}

export default {
    firebaseLogin
}