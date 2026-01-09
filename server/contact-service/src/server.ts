import cors from "cors";
import express from "express";
import config from "./config/config";
import contactRoutes from "./routes/contactRoutes";

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173"], // Allow frontend
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
    console.log(`Contact Service running on port ${PORT}`);
    console.log(`Environment: ${config.env}`);
});
