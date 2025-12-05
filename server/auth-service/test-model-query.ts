// Test script to verify Mongoose connection and model usage
import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: "./.env" });

const MONGO_URI = process.env.MONGO_URI!;

// Define User schema and model
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: String,
    otpExpiresAt: Date,
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

async function test() {
    try {
        console.log("1. Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        
        console.log("2. Connected! Connection state:", mongoose.connection.readyState);
        
        console.log("3. Testing findOne operation...");
        const user = await User.findOne({ email: "vratik.zade.15@gmail.com" });
        console.log("4. Query successful! User:", user ? "Found" : "Not found");
        
        await mongoose.connection.close();
        console.log("5. Test completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

test();
