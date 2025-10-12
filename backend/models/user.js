import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  joinedDate: { type: Date, default: Date.now },
  notificationEnabled: { type: Boolean, default: true }, // New field
  language: { type: String, default: "en" },
  phone: { type: String, default: "" }
});

const User = mongoose.model("User", UserSchema);
export default User;