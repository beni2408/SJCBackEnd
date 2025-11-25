import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/connectDB.js";
import authRouter from "./src/routes/memberRoutes.js";
import taxRouter from "./src/routes/taxRoutes.js";
import offeringRouter from "./src/routes/offeringRoutes.js";
import committeeRouter from "./src/routes/committeeRoutes.js";
import announcementRouter from "./src/routes/announcementRoutes.js";
import dashboardRouter from "./src/routes/dashboardRoutes.js";
import superAdminRouter from "./src/routes/superAdminRoutes.js";
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tax", taxRouter);
app.use("/api/offering", offeringRouter);
app.use("/api/committee", committeeRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/super-admin", superAdminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
