const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    applicantId: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    beneficiaryName: { type: String, required: true },
    beneficiaryAge: { type: Number },
    beneficiaryContact: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    resolvedBy: { type: Number },
    resolutionDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
