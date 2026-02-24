import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { ApiError } from "../utils/ApiError";

// Extend Express Request type
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

interface JwtPayload {
    id: string;
    email: string;
    role?: string;
    firebaseUid?: string;
    iat: number;
    exp: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Authentication required. Please provide a valid token.");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Authentication required. Please provide a valid token.");
        }

        // Verify token
        const jwtSecret = config.JWT_SECRET as string;

        if (!jwtSecret) {
            throw new ApiError(500, "JWT secret is not configured");
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // Attach user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || "user",
            firebaseUid: decoded.firebaseUid,
            subject: decoded.firebaseUid || decoded.id,
        };

        next();
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message
            });
        }

        // Handle JWT specific errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: 401,
                message: "Invalid token. Please login again."
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 401,
                message: "Token expired. Please login again."
            });
        }

        // Generic error
        return res.status(500).json({
            status: 500,
            message: "Authentication failed"
        });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            status: 401,
            message: "Authentication required",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            status: 403,
            message: "Admin access required",
        });
    }

    next();
};
