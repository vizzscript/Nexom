import cors from 'cors';
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../../common/db/connection";
import config from "./config/config";
import { errorConverter, errorHandler } from "./middleware";
import categoryRouter from "./routes/category.routes";
import serviceRouter from "./routes/service.routes";

const app = express();
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ["http://localhost:5173"];

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

app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/categories", categoryRouter);


// Error handling middleware (must be after routes)
app.use(errorConverter);
app.use(errorHandler);

const startServer = async () => {
    try {
        // Connect to database first
        await connectDB(mongoose, config.MONGO_URI as string);

        // Start HTTP server after database is connected
        app.listen(config.SERVICE_PORT, () => {
            console.log(`Service Catalog is running on PORT: ${config.SERVICE_PORT}`);
            console.log(`Database connected successfully`);
        });
    } catch (err) {
        console.error("Failed to start service-catalog:", err);
        process.exit(1);
    }
};

startServer();