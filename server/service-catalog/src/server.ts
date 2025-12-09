import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../../common/db/connection";
import config from "./config/config";
import { errorConverter, errorHandler } from "./middleware";
import categoryRouter from "./routes/category.routes";
import serviceRouter from "./routes/service.routes";

const app = express();
app.use(express.json());

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
            console.log(`Service Catalog running on PORT: ${config.SERVICE_PORT}`);
        });
    } catch (err) {
        console.error("Failed to start service-catalog:", err);
        process.exit(1);
    }
};

startServer();