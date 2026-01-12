import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    const configFile = `./.env`;
    config({ path: configFile });
}

const { CONTACT_PORT, PORT, NODE_ENV, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;

export default {
    PORT: PORT || CONTACT_PORT || 8083,
    env: NODE_ENV,
    smtp: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        pass: SMTP_PASS
    },
    adminEmail: ADMIN_EMAIL || SMTP_USER // Default to sending to the sender if not specified
}
