import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

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
        return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT secret is not configured" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || "user",
            firebaseUid: decoded.firebaseUid,
            subject: decoded.firebaseUid || decoded.id,
        };
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
