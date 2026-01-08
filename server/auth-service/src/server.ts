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

const nexomUrl = process.env.NEXOM_FRONTEND_URL;

app.use(cors({
    origin: nexomUrl,
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
            console.log(`Server is running on PORT ${config.AUTH_PORT}`);
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