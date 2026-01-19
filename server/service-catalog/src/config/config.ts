import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    const configFile = `./.env`;
    config({ path: configFile });
}

const { PORT, MONGO_URI, JWT_SECRET, NODE_ENV, ALLOWED_ORIGINS } = process.env;

export default {
    SERVICE_PORT: PORT || 8082,
    MONGO_URI,
    JWT_SECRET,
    ALLOWED_ORIGINS: ALLOWED_ORIGINS
        ? ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : ["http://localhost:5173"],
    env: NODE_ENV
}