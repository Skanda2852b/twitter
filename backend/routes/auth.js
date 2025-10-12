import express from "express";
import User from "../models/user.js";
import LoginHistory from "../models/loginHistory.js";

const router = express.Router();

// Forgot password with daily limit
router.post("/forgot-password", async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    
    const user = await User.findOne({ 
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already requested today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.lastForgotRequestAt && user.lastForgotRequestAt >= today) {
      return res.status(429).json({ 
        error: "Password reset already requested today. Please try again tomorrow." 
      });
    }

    // Generate random password (letters only)
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += letters[Math.floor(Math.random() * letters.length)];
    }

    // Update user
    user.lastForgotRequestAt = new Date();
    await user.save();

    // In production, send email with new password
    console.log(`New password for ${user.email}: ${newPassword}`);
    
    res.json({ 
      success: true, 
      password: newPassword,
      message: "New password generated. Please check your email." 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track login
router.post("/track-login", async (req, res) => {
  try {
    const { userId, ipAddress, userAgent, browser, os, deviceType } = req.body;
    
    const loginRecord = new LoginHistory({
      user: userId,
      ipAddress,
      userAgent,
      browser,
      os,
      deviceType,
      loginTime: new Date(),
      success: true
    });

    await loginRecord.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get login history
router.get("/login-history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await LoginHistory.find({ user: userId })
      .sort({ loginTime: -1 })
      .limit(10);
    
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send OTP for audio upload
router.post("/send-otp", async (req, res) => {
  try {
    const { email, type } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, send OTP via email
    console.log(`OTP for ${email} (${type}): ${otp}`);
    
    res.json({ 
      success: true, 
      message: "OTP sent to your email",
      otp: otp // Remove in production
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP for audio upload
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, type } = req.body;
    
    // In production, verify OTP from email
    // For demo, any 6-digit OTP is accepted
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    
    res.json({ 
      success: true, 
      message: "OTP verified successfully" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;