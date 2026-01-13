import cors from "cors";
import express from "express";
import config from "./config/config";
import contactRoutes from "./routes/contactRoutes";

const app = express();

// Middleware
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/contact", contactRoutes);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", service: "contact-service" });
});

// Start server
const PORT = config.PORT || 8083;
app.listen(PORT, () => {
    console.log(`Contact Service is running on port ${PORT}`);
    console.log(`Mode: ${config.env || 'development'}`);
});
