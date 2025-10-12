// backend/middleware/loginTracker.js
import LoginHistory from "../models/loginHistory.js";
import UAParser from "ua-parser-js";

export const trackLogin = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const loginRecord = new LoginHistory({
      user: req.user?._id,
      ipAddress: ip,
      userAgent: userAgent,
      browser: result.browser.name || 'Unknown',
      os: result.os.name || 'Unknown',
      deviceType: result.device.type || 'desktop',
      location: await getLocationFromIP(ip)
    });

    await loginRecord.save();
    next();
  } catch (error) {
    console.error('Login tracking error:', error);
    next();
  }
};

// Check if mobile access is allowed (10 AM - 1 PM)
export const checkMobileAccess = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  if (result.device.type === 'mobile') {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    
    if (hours < 10 || hours >= 13) {
      return res.status(403).json({ 
        error: "Mobile access is only allowed between 10:00 AM - 1:00 PM IST" 
      });
    }
  }
  next();
};

// Browser-specific authentication
export const browserAuth = async (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  
  if (userAgent.includes('Chrome')) {
    // Chrome requires OTP - implement OTP logic here
    req.requiresOTP = true;
  } else if (userAgent.includes('Edg')) {
    // Microsoft Edge - no OTP required
    req.requiresOTP = false;
  }
  
  next();
};

async function getLocationFromIP(ip) {
  // Implement IP geolocation service
  // For demo, return unknown
  return 'Unknown';
}