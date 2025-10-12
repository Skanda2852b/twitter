import express from "express";
import Tweet from "../models/tweet.js";
import User from "../models/user.js";

const router = express.Router();

// Check if current time is between 2-7 PM IST
function isWithinAudioTime() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const hours = istTime.getUTCHours();
  
  return hours >= 14 && hours < 19; // 2 PM to 7 PM IST
}

// Upload audio tweet
router.post("/upload", async (req, res) => {
  try {
    const { author, content, audioUrl, audioDuration, audioSize, email } = req.body;
    
    if (!isWithinAudioTime()) {
      return res.status(400).json({ 
        error: "Audio tweets are only allowed between 2:00 PM - 7:00 PM IST" 
      });
    }

    // Check file size (100MB limit)
    if (audioSize > 100 * 1024 * 1024) {
      return res.status(400).json({ 
        error: "Audio file exceeds 100MB limit" 
      });
    }

    // Check duration (5 minutes limit)
    if (audioDuration > 300) {
      return res.status(400).json({ 
        error: "Audio duration exceeds 5 minutes limit" 
      });
    }

    const user = await User.findById(author);
    if (!user || user.email !== email) {
      return res.status(400).json({ error: "Invalid user" });
    }

    // Create audio tweet
    const tweet = new Tweet({
      author,
      content: content || "",
      audioUrl,
      audioDuration,
      audioSize,
      isAudio: true,
      timestamp: new Date()
    });

    await tweet.save();
    
    res.json({ 
      success: true, 
      tweet,
      message: "Audio tweet posted successfully!" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;