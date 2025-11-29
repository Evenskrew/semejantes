const mongoose = require("mongoose");
const { Schema } = mongoose;

const DonationSchema = new Schema(
  {
    itemName: { type: String, required: true },
    type: { type: String },

    available: { type: Boolean, default: true },

    deliveredTo: { type: String },
    deliveryDate: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", DonationSchema);
