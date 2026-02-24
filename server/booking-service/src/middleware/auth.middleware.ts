import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    email: string;
    role?: string;
    firebaseUid?: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
                firebaseUid?: string;
                subject: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ success: false, message: "JWT secret is not configured" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        const subject = decoded.firebaseUid || decoded.id;
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || "user",
            firebaseUid: decoded.firebaseUid,
            subject,
        };
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const authenticateInternal = (req: Request, res: Response, next: NextFunction) => {
    const internalToken = req.header("x-internal-token");
    const expectedToken = process.env.BOOKING_INTERNAL_TOKEN;

    if (!expectedToken) {
        return res.status(500).json({ success: false, message: "Internal token is not configured" });
    }

    if (!internalToken || internalToken !== expectedToken) {
        return res.status(401).json({ success: false, message: "Unauthorized internal request" });
    }

    next();
};
