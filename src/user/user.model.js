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
      enum: ["Voluntario", "Coordinador"],
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
  cargo: { type: String, required: true },
});

const Coordinador = User.discriminator("Coordinador", CoordinatorSchema);

const VolunteerSchema = new Schema({
  disponibilidad: { type: String, required: true },
});

const Voluntario = User.discriminator("Voluntario", VolunteerSchema);

module.exports = { User, Coordinador, Voluntario };
