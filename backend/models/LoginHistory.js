import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  browser: { type: String, required: true },
  os: { type: String, required: true },
  deviceType: { type: String, enum: ["desktop", "mobile", "tablet"], required: true },
  location: { type: String, default: "Unknown" },
  loginTime: { type: Date, default: Date.now },
  success: { type: Boolean, default: true },
  requiresOTP: { type: Boolean, default: false },
  otpVerified: { type: Boolean, default: false }
});

const LoginHistory = mongoose.model("LoginHistory", LoginHistorySchema);
export default LoginHistory;