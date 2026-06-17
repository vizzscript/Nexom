import { config } from "dotenv";

config({ path: "./.env" });

const { CONTACT_PORT, NODE_ENV, MONGO_URI } = process.env;

export default {
    PORT: CONTACT_PORT || 8083,
    env: NODE_ENV,
    mongoUri: MONGO_URI
}
