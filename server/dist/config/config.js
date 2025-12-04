"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const configFile = `./.env`;
(0, dotenv_1.config)({ path: configFile });
const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
exports.default = {
    MONGO_URI,
    PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    smtp: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        pass: SMTP_PASS
    }
};
