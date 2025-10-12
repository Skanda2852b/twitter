import express from "express";
import User from "../models/user.js";
import Tweet from "../models/tweet.js";
import mongoose from "mongoose";

const router = express.Router();

// Test route to verify notifications route is working
router.get("/test", (req, res) => {
  res.json({ message: "Notifications route is working" });
});

// Check for keyword notifications when new tweet is posted
router.post("/check-keywords", async (req, res) => {
  try {
    const { tweetId } = req.body;
    
    // Validate tweetId
    if (!tweetId) {
      return res.status(400).json({ error: "Tweet ID is required" });
    }

    // Check if tweetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      return res.status(400).json({ error: "Invalid Tweet ID" });
    }

    const tweet = await Tweet.findById(tweetId).populate("author");
    
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    const keywords = ["cricket", "science"];
    const foundKeywords = keywords.filter(keyword => 
      tweet.content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (foundKeywords.length > 0) {
      // Get users who have notifications enabled
      const users = await User.find({ notificationEnabled: true });
      
      return res.json({
        notification: true,
        message: `Keywords detected: ${foundKeywords.join(', ')}`,
        tweet: {
          content: tweet.content,
          author: tweet.author.displayName,
          keywords: foundKeywords
        },
        usersNotified: users.length
      });
    }

    res.json({ notification: false });
  } catch (error) {
    console.error("Notification check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Toggle notifications
router.patch("/toggle/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { enabled } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Decode the email in case it was URL encoded
    const decodedEmail = decodeURIComponent(email);
    const user = await User.findOneAndUpdate(
      { email: decodedEmail },
      { notificationEnabled: enabled },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ 
      success: true, 
      user: {
        email: user.email,
        notificationEnabled: user.notificationEnabled
      }
    });
  } catch (error) {
    console.error("Toggle notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get notification status
router.get("/status/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Notification status request for email:", email);
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Decode the email in case it was URL encoded
    const decodedEmail = decodeURIComponent(email);
    console.log("Decoded email:", decodedEmail);
    
    const user = await User.findOne({ email: decodedEmail });
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      notificationEnabled: user.notificationEnabled ?? true 
    });
  } catch (error) {
    console.error("Get notification status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;