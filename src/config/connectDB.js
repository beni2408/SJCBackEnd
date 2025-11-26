import mongoose from "mongoose";

import dotenv from "dotenv";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI environment variable is not set");
    process.exit(1);
  }

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        // bufferMaxEntries: 0,
        maxPoolSize: 10,
      });
      console.log("Connected to MongoDB");
      return;
    } catch (error) {
      retries++;
      console.log(
        `MongoDB connection attempt ${retries} failed:`,
        error.message
      );
      if (retries >= maxRetries) {
        console.log("Max retries reached. Exiting...");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

export default connectDB;
