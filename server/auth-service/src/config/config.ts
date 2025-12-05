import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const { MONGO_URI, AUTH_PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

export default {
    MONGO_URI,
    AUTH_PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    smtp: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        pass: SMTP_PASS
    }
}