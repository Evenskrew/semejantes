const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      minLength: 3,
      maxLength: 32,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      minLength: 3,
      maxLength: 256,
      unique: true,
      required: true,
    },
    password: { type: String, minLength: 3, maxLength: 512, required: true },
    role: {
      type: String,
      enum: ["Volunteer", "Coordinator"],
      required: true,
    },
    phone: [{ type: Number }],
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

const User = mongoose.model("User", UserSchema);

const CoordinatorSchema = new Schema({
  position: { type: String, required: true },
});

const Coordinator = User.discriminator("Coordinator", CoordinatorSchema);

const VolunteerSchema = new Schema({
  availability: { type: String, required: true },
  hoursContributed: { type: Number, default: 0 },
  speciality: { type: String, required: true },
});

const Volunteer = User.discriminator("Volunteer", VolunteerSchema);

module.exports = { User, Coordinator, Volunteer };