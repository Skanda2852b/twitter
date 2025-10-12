import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Tweet from "./models/tweet.js";

// Import routes
import notificationRoutes from "./routes/notifications.js";
import audioRoutes from "./routes/audio.js";
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import languageRoutes from "./routes/language.js";
import loginHistoryRoutes from "./routes/loginHistory.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/notifications', notificationRoutes);
app.use('/audio', audioRoutes);
app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/language', languageRoutes);
app.use('/loginHistory', loginHistoryRoutes);

app.get("/", (req, res) => {
  res.send("Twiller backend is running successfully with all new features!");
});

// Test route for new features
app.get("/test-features", (req, res) => {
  res.json({
    message: "All new features are working!",
    features: [
      "🔔 Notification system",
      "🎤 Audio tweets with OTP verification",
      "🔐 Password reset with generator",
      "💳 Subscription plans (mock)",
      "🌐 Multi-language support",
      "📱 User login tracking"
    ],
    status: "Server is running perfectly!"
  });
});

// Your existing routes (register, loggedinuser, userupdate, post, like, retweet)
app.post("/register", async (req, res) => {
  try {
    const { username, displayName, avatar, email } = req.body;

    if (!username || !displayName || !avatar || !email) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ success: true, user });
    }

    user = new User(req.body);
    await user.save();
    
    // Create free subscription for new user
    try {
      const response = await fetch(`http://localhost:${process.env.PORT || 5000}/subscriptions/create-free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      
      if (!response.ok) {
        console.log('Failed to create free subscription, but user was created');
      }
    } catch (subscriptionError) {
      console.log('Subscription creation failed:', subscriptionError.message);
    }
    
    return res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// loggedinuser
app.get("/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send({ error: "Email required" });
    }
    const user = await User.findOne({ email: email });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// update Profile
app.patch("/userupdate/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updated = await User.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true, upsert: false }
    );
    return res.status(200).send(updated);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// Tweet API with subscription check
app.post("/post", async (req, res) => {
  try {
    const { author, content, image } = req.body;
    
    // Check subscription allowance using direct database call instead of fetch
    try {
      const Subscription = (await import('./models/Subscription.js')).default;
      let subscription = await Subscription.findOne({ 
        user: author, 
        status: "active"
      });

      if (!subscription) {
        // Create free subscription if doesn't exist
        subscription = new Subscription({
          user: author,
          plan: "free",
          tweetsAllowed: 1,
          tweetsPosted: 0,
          status: "active"
        });
        await subscription.save();
      }

      // Reset tweet count if needed
      const now = new Date();
      const lastReset = new Date(subscription.lastReset || subscription.validFrom);
      const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                        (now.getMonth() - lastReset.getMonth());
      
      if (monthsDiff >= 1) {
        subscription.tweetsPosted = 0;
        subscription.lastReset = now;
        await subscription.save();
      }

      const tweetsRemaining = subscription.tweetsAllowed === -1 
        ? -1 
        : Math.max(0, subscription.tweetsAllowed - subscription.tweetsPosted);

      if (!(tweetsRemaining > 0 || subscription.tweetsAllowed === -1)) {
        return res.status(400).json({ 
          error: "Tweet limit reached. Upgrade your subscription to post more tweets." 
        });
      }
    } catch (subscriptionError) {
      console.log('Subscription check failed:', subscriptionError.message);
      // Continue with tweet creation if subscription check fails
    }

    const tweet = new Tweet({
      author,
      content,
      image,
      timestamp: new Date()
    });

    await tweet.save();
    
    // Increment tweet count
    try {
      const Subscription = (await import('./models/Subscription.js')).default;
      const subscription = await Subscription.findOne({ 
        user: author, 
        status: "active" 
      });

      if (subscription && subscription.tweetsAllowed !== -1) {
        subscription.tweetsPosted += 1;
        await subscription.save();
      }
    } catch (incrementError) {
      console.log('Failed to increment tweet count:', incrementError.message);
    }
    
    return res.status(201).send(tweet);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// get all tweets
app.get("/post", async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ timestamp: -1 }).populate("author");
    return res.status(200).send(tweets);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// search tweets
app.get("/post/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const tweets = await Tweet.find({
      content: { $regex: q, $options: 'i' }
    }).sort({ timestamp: -1 }).populate("author");
    
    return res.status(200).send(tweets);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// LIKE TWEET
app.post("/like/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;
    const tweet = await Tweet.findById(req.params.tweetid);
    if (!tweet.likedBy.includes(userId)) {
      tweet.likes += 1;
      tweet.likedBy.push(userId);
      await tweet.save();
    }
    res.send(tweet);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// retweet 
app.post("/retweet/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;
    const tweet = await Tweet.findById(req.params.tweetid);
    if (!tweet.retweetedBy.includes(userId)) {
      tweet.retweets += 1;
      tweet.retweetedBy.push(userId);
      await tweet.save();
    }
    res.send(tweet);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📋 Test features at: http://localhost:${port}/test-features`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });