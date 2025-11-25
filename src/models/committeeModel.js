import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    committeeType: {
      type: String,
      enum: ["LCF", "Pastorate"],
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    photo: {
      type: String,
    },
    hierarchy: {
      type: Number,
      default: 0,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CommitteeModel = mongoose.model("Committee", committeeSchema);