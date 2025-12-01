import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDatabase = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;

    if (!MONGO_URL) {
      throw new Error("MONGO_URL is missing in environment variables");
    }

    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully!");
  } catch (error: any) {
    console.log(`Error connecting to database: ${error.message}`);
  }
};

export default connectDatabase;
