import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
  {
    memberID: {
      type: String,
      required: true,
    },
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
      enum: ["DC", "Secretary", "Treasurer", "Member"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: function() {
        return this.committeeType === "Pastorate";
      }
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: function() {
        return this.committeeType === "Pastorate";
      }
    },
    memberCategory: {
      type: String,
      enum: ["DC", "Secretary", "Treasurer", "Under35", "Women", "CC", "Regular"],
      required: function() {
        return this.committeeType === "Pastorate";
      }
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

const reverendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["Council Chairman", "Pastorate Chairman", "Madathuvilai Church Presbyter"],
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
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CommitteeModel = mongoose.model("Committee", committeeSchema);
export const ReverendModel = mongoose.model("Reverend", reverendSchema);