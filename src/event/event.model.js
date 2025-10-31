const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    description: { type: String, required: true },
    date: { type: String, required: true },
    duration: { type: Number, required: true },
    participantes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
