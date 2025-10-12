import express from "express";
import User from "../models/user.js";

const router = express.Router();

const otpStore = new Map();

const supportedLanguages = {
  en: "English",
  es: "Spanish", 
  hi: "Hindi",
  pt: "Portuguese",
  zh: "Chinese",
  fr: "French"
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP for language change
router.post("/request-otp", async (req, res) => {
  try {
    const { email, phone, language } = req.body;
    
    if (!Object.keys(supportedLanguages).includes(language)) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const user = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    const key = email || phone;
    
    otpStore.set(key, { 
      otp, 
      language,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      type: email ? 'email' : 'phone'
    });

    // In production, send OTP via email or SMS
    console.log(`Language change OTP for ${key}: ${otp}`);
    
    res.json({ 
      success: true, 
      message: language === 'fr' ? 
        "OTP sent to email for French language verification" :
        "OTP sent for language verification",
      otp: otp, // Remove in production
      method: language === 'fr' ? 'email' : 'phone'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change language after OTP verification
router.post("/change", async (req, res) => {
  try {
    const { email, phone, otp, language } = req.body;
    
    if (!Object.keys(supportedLanguages).includes(language)) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const key = email || phone;
    const storedData = otpStore.get(key);
    
    if (!storedData) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(key);
      return res.status(400).json({ error: "OTP expired" });
    }

    // Verify French requires email, others require phone
    if (language === 'fr' && storedData.type !== 'email') {
      return res.status(400).json({ error: "French language requires email verification" });
    }

    if (language !== 'fr' && storedData.type !== 'phone') {
      return res.status(400).json({ error: "This language requires phone verification" });
    }

    // Update user language
    const user = await User.findOneAndUpdate(
      { $or: [{ email }, { phone }] },
      { language: language },
      { new: true }
    );

    otpStore.delete(key);

    res.json({ 
      success: true, 
      user: {
        email: user.email,
        language: user.language
      },
      message: `Language changed to ${supportedLanguages[language]}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported languages
router.get("/supported", (req, res) => {
  res.json(supportedLanguages);
});

// Get user's current language
router.get("/current/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    res.json({ 
      language: user?.language || 'en',
      supportedLanguages 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;