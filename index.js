import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/connectDB.js";
import authRouter from "./src/routes/memberRoutes.js";
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
