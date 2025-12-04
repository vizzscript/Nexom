import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: './.env' });

async function dropOldIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db!.collection('users');

        // Drop the old mobileNumber index
        await usersCollection.dropIndex('mobileNumber_1');
        console.log('✅ Successfully dropped mobileNumber_1 index');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error: any) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

dropOldIndex();
