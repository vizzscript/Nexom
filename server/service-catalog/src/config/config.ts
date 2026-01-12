import { config } from "dotenv";
import path from "path";

// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
    const authServiceEnvPath = path.join(__dirname, "../../../auth-service/.env");
    config({ path: authServiceEnvPath });
    const localEnvPath = path.join(__dirname, "../../.env");
    config({ path: localEnvPath });
}

const { SERVICE_PORT, PORT, MONGO_URI, JWT_SECRET, NODE_ENV } = process.env;

export default {
    SERVICE_PORT: PORT || SERVICE_PORT || 8082,
    MONGO_URI,
    JWT_SECRET,
    env: NODE_ENV
}