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
      enum: ["basic", "admin"],
      default: "basic",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
