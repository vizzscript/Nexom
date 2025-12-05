
export const connectDB = async (mongooseInstance: any, mongoUri: string) => {
    try {
        console.info("Connecting to database..." + mongoUri);

        await mongooseInstance.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.info("Database connected!");
        console.info("MongoDB connection state:", mongooseInstance.connection.readyState); // 1 = connected

        // Wait for indexes to be built
        await mongooseInstance.connection.asPromise();
        console.info("MongoDB ready for operations");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}