import { config } from "dotenv";
import path from "path";

// Load auth-service .env for shared config (MONGO_URI, JWT_SECRET, NODE_ENV)
const authServiceEnvPath = path.join(__dirname, "../../../auth-service/.env");
config({ path: authServiceEnvPath });

// Load local .env for service-specific config (SERVICE_PORT)
const localEnvPath = path.join(__dirname, "../../.env");
config({ path: localEnvPath });

const { SERVICE_PORT, MONGO_URI, JWT_SECRET, NODE_ENV } = process.env;

export default {
    SERVICE_PORT,
    MONGO_URI,
    JWT_SECRET,
    env: NODE_ENV
}