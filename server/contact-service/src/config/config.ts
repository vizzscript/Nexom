import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    const configFile = `./.env`;
    config({ path: configFile });
}

const { CONTACT_PORT, NODE_ENV, MONGO_URI } = process.env;

export default {
    PORT: CONTACT_PORT || 8083,
    env: NODE_ENV,
    mongoUri: MONGO_URI
}
