import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async (): Promise<typeof mongoose> => {
	if (isConnected) {
		return mongoose;
	}

	try {
		if (!process.env.MONGO_URI) {
			throw new Error(
				"MONGO_URI is not defined in environment variables"
			);
		}

		const conn = await mongoose.connect(process.env.MONGO_URI);
		isConnected = true;
		console.log("Database connected successfully");
		return conn;
	} catch (error) {
		console.error("Error connecting to database:", error);
		throw error;
	}
};

export const disconnectDb = async (): Promise<void> => {
	if (isConnected) {
		await mongoose.disconnect();
		isConnected = false;
		console.log("Database disconnected");
	}
};
