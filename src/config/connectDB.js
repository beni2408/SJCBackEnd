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
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
