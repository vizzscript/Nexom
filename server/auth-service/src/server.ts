import express, { Express } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import config from "./config/config";
import { connectDB } from "./database";
import { errorConverter, errorHandler } from "./middleware";
import userRouter from "./routes/authRoutes";
import { rabbitMQService } from "./services/RabbitMQService";

import cors from "cors";

const app: Express = express();
let server: Server;

const allowedOrigins = [
    "http://localhost:5173",
    "https://nexom-zeta.vercel.app",
    "https://nexom-jke6d1oxj-vizzscripts-projects.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", userRouter);
app.use(errorConverter);
app.use(errorHandler);

const startServer = async () => {
    try {
        // Connect to database first
        await connectDB(mongoose, config.MONGO_URI as string);

        // Start HTTP server after database is connected
        server = app.listen(config.AUTH_PORT, () => {
            console.log(`Auth Service is running on PORT ${config.AUTH_PORT}`);
            console.log(`CORS allowed for: ${allowedOrigins.join(', ')}`);
        });

        // Initialize RabbitMQ client (non-blocking if it fails)
        try {
            await rabbitMQService.init();
            console.log("RabbitMQ client initialized and listening for messages.");
        } catch (rabbitMQError) {
            console.warn("Warning: RabbitMQ connection failed. Server will continue without message queue functionality.");
            console.warn("RabbitMQ Error:", rabbitMQError);
        }
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        })
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
}

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);