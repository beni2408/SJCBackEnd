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

// Root route for API status
app.get("/", (req, res) => {
  res.json({
    message: "St. John's Church Management System API",
    status: "Running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      tax: "/api/tax",
      offering: "/api/offering",
      committee: "/api/committee",
      announcement: "/api/announcement",
      dashboard: "/api/dashboard",
      superAdmin: "/api/super-admin"
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/tax", taxRouter);
app.use("/api/offering", offeringRouter);
app.use("/api/committee", committeeRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/super-admin", superAdminRouter);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
