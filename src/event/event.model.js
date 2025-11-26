const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 1 },
    participantes: [
      {
        type: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
