import express from "express";
import LoginHistory from "../models/loginHistory.js";
import User from "../models/user.js";

const router = express.Router();

// Parse user agent string
function parseUserAgent(userAgent) {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "desktop";

  // Browser detection
  if (userAgent.includes('Chrome')) browser = "Chrome";
  else if (userAgent.includes('Firefox')) browser = "Firefox";
  else if (userAgent.includes('Safari')) browser = "Safari";
  else if (userAgent.includes('Edg')) browser = "Edge";

  // OS detection
  if (userAgent.includes('Windows')) os = "Windows";
  else if (userAgent.includes('Mac')) os = "macOS";
  else if (userAgent.includes('Linux')) os = "Linux";
  else if (userAgent.includes('Android')) os = "Android";
  else if (userAgent.includes('iOS')) os = "iOS";

  // Device type detection
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iOS')) {
    deviceType = "mobile";
  } else if (userAgent.includes('Tablet')) {
    deviceType = "tablet";
  }

  return { browser, os, deviceType };
}

// Check if mobile access is allowed (10 AM - 1 PM IST)
function isMobileAccessAllowed() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const hours = istTime.getUTCHours();
  
  return hours >= 10 && hours < 13; // 10 AM to 1 PM
}

// Check if browser requires OTP
function requiresOTP(browser) {
  return browser.toLowerCase().includes('chrome');
}

// Record login attempt
router.post("/record", async (req, res) => {
  try {
    const { userId, ipAddress, userAgent } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { browser, os, deviceType } = parseUserAgent(userAgent);
    
    // Check mobile access restriction
    if (deviceType === "mobile" && !isMobileAccessAllowed()) {
      const loginRecord = new LoginHistory({
        user: userId,
        ipAddress,
        userAgent,
        browser,
        os,
        deviceType,
        success: false,
        requiresOTP: false
      });
      await loginRecord.save();

      return res.status(403).json({ 
        error: "Mobile access is only allowed between 10:00 AM - 1:00 PM IST",
        mobileAccessAllowed: false
      });
    }

    // Check if OTP is required
    const needsOTP = requiresOTP(browser);

    const loginRecord = new LoginHistory({
      user: userId,
      ipAddress,
      userAgent,
      browser,
      os,
      deviceType,
      success: true,
      requiresOTP: needsOTP,
      otpVerified: !needsOTP // Auto-verified for non-Chrome browsers
    });

    await loginRecord.save();

    res.json({
      success: true,
      requiresOTP: needsOTP,
      browser: browser,
      deviceType: deviceType,
      mobileAccessAllowed: true,
      message: needsOTP ? 
        "OTP verification required for Chrome browser" : 
        "Login recorded successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's login history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const history = await LoginHistory.find({ user: userId })
      .sort({ loginTime: -1 })
      .limit(parseInt(limit))
      .select('ipAddress browser os deviceType location loginTime success requiresOTP otpVerified');

    res.json({
      success: true,
      history: history,
      total: history.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP for login (mock)
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // In production, verify OTP from email
    // For demo, any 6-digit OTP is accepted
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update the latest login record
    await LoginHistory.findOneAndUpdate(
      { user: userId, requiresOTP: true, otpVerified: false },
      { otpVerified: true },
      { sort: { loginTime: -1 } }
    );

    res.json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;