import { Schema, model } from "mongoose";

const userSchema = new Schema({
  id: {
    type: String,
    required: "true",
  },
  email: {
    type: String,
    required: "true",
  },
  firstName: {
    type: String,
    required: "true",
  },
  lastName: {
    type: String,
    required: "true",
  },
  password: {
    type: String,
    required: "true",
  },
  active: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

const userModel = new model("user", userSchema, "users");

export { userModel };
