import mongoose from "mongoose";

import dotenv from "dotenv";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI environment variable is not set");
    process.exit(1);
  }

  mongoose.set('bufferCommands', false);
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
