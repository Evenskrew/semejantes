const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 1 },
    place: { type: String },
    requirements: { type: String },
    images: [{ type: String }],
    participantes: [{ type: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
