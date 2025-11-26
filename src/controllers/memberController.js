import MemberModel from "../models/memberModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendWelcomeEmail,
  sendLoginNotification,
} from "../utils/emailService.js";
import { generateMemberID } from "../utils/generateMemberID.js";
import dotenv from "dotenv";
dotenv.config();
export const newMember = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      hometaxno,
      gender,
      dateOfBirth,
      age,
      phone,
      address,
      role,
    } = req.body;

    const memberID = await generateMemberID(hometaxno);

    const member = await MemberModel.create({
      memberID,
      name,
      email,
      password,
      hometaxno,
      gender,
      dateOfBirth,
      age,
      phone,
      address,
      role,
    });
    try {
      await sendWelcomeEmail(email, name, memberID);
    } catch (emailError) {
      console.log("Welcome email failed:", emailError.message);
    }
    res
      .status(201)
      .json({ message: "Member created successfully", member, memberID });
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate error:", error.keyPattern);
      const field = Object.keys(error.keyPattern)[0];
      const message =
        field === "email"
          ? "Email already exists"
          : field === "phone"
          ? "Phone number already exists"
          : field === "memberID"
          ? "Member ID already exists"
          : "Duplicate field error";
      return res.status(400).json({ message, field });
    }
    res
      .status(500)
      .json({ message: "Failed to create member", error: error.message });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { memberID, password } = req.body;
    
    const member = await MemberModel.findOne({ memberID }).maxTimeMS(2000).lean();
    if (!member) {
      return res.status(401).json({ message: "Invalid member ID or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, member.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid member ID or password" });
    }
    const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    try {
      await sendLoginNotification(member.email, member.name);
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
    }
    res
      .status(200)
      .json({ message: "Login successful", token, memberID: member.memberID });
  } catch (error) {
    console.log("Login error:", error.message);
    if (error.name === 'MongoTimeoutError' || error.message.includes('buffering timed out')) {
      return res.status(503).json({ message: "Database temporarily unavailable. Please try again." });
    }
    res
      .status(500)
      .json({ message: "Failed to login member", error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { memberID } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedMember = await MemberModel.findOneAndUpdate(
      { memberID },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member updated successfully", member: updatedMember });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update member", error: error.message });
  }
};
