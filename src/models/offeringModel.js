import mongoose from "mongoose";

const monthlyOfferingSchema = new mongoose.Schema(
  {
    hometaxno: {
      type: String,
      required: true,
    },
    offeringType: {
      type: String,
      enum: ["Paribalana Committee", "Church Construction"],
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const specialOfferingSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    purpose: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MonthlyOfferingModel = mongoose.model("MonthlyOffering", monthlyOfferingSchema);
export const SpecialOfferingModel = mongoose.model("SpecialOffering", specialOfferingSchema);