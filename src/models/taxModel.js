import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    taxID: {
      type: String,
      required: true,
      unique: true,
    },
    taxType: {
      type: String,
      enum: ["Yearly Tax", "Rice Tax", "Asanam Tax", "Christmas Tax"],
      required: true,
    },
    taxYear: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const taxPaymentSchema = new mongoose.Schema(
  {
    hometaxno: {
      type: String,
      required: true,
    },
    taxType: {
      type: String,
      enum: ["Yearly Tax", "Rice Tax", "Asanam Tax", "Christmas Tax"],
      required: true,
    },
    taxYear: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: String,
      required: true,
    },
    paidDate: {
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

export const TaxModel = mongoose.model("Tax", taxSchema);
export const TaxPaymentModel = mongoose.model("TaxPayment", taxPaymentSchema);