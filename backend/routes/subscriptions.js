import express from "express";
import Subscription from "../models/Subscription.js";
import User from "../models/user.js";

const router = express.Router();

const plans = {
  free: { tweets: 1, price: 0, name: "Free" },
  bronze: { tweets: 3, price: 100, name: "Bronze" },
  silver: { tweets: 5, price: 300, name: "Silver" },
  gold: { tweets: -1, price: 1000, name: "Gold" } // -1 for unlimited
};

// Check if current time is between 10-11 AM IST
function isWithinPaymentTime() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const hours = istTime.getUTCHours();
  
  return hours === 10; // 10 AM IST only
}

// Mock payment session creation
router.post("/create-subscription", async (req, res) => {
  try {
    const { plan, userId } = req.body;
    
    if (!isWithinPaymentTime()) {
      return res.status(400).json({ 
        error: "Payments are only accepted between 10:00 AM - 11:00 AM IST" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    // Create mock payment session
    const mockSession = {
      id: 'mock_pay_' + Date.now(),
      url: '/mock-checkout',
      amount: selectedPlan.price,
      currency: 'INR',
      plan: plan
    };

    // Create subscription immediately for demo
    const subscription = new Subscription({
      user: userId,
      plan: plan,
      tweetsAllowed: selectedPlan.tweets,
      tweetsPosted: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentId: mockSession.id,
      status: "active"
    });

    await subscription.save();

    // In production, send invoice email
    console.log(`Invoice for ${user.email}: ${selectedPlan.name} Plan - ₹${selectedPlan.price}`);

    res.json({ 
      success: true,
      session: mockSession,
      subscription: subscription,
      message: `Successfully subscribed to ${selectedPlan.name} Plan!`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check tweet allowance
router.get("/tweet-allowance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let subscription = await Subscription.findOne({ 
      user: userId, 
      status: "active"
    });

    if (!subscription) {
      // Create free subscription if doesn't exist
      subscription = new Subscription({
        user: userId,
        plan: "free",
        tweetsAllowed: 1,
        tweetsPosted: 0,
        status: "active"
      });
      await subscription.save();
    }

    // Reset tweet count if needed
    subscription.resetTweetCount();
    await subscription.save();

    const tweetsRemaining = subscription.tweetsAllowed === -1 
      ? -1 // Unlimited
      : Math.max(0, subscription.tweetsAllowed - subscription.tweetsPosted);

    res.json({
      plan: subscription.plan,
      tweetsAllowed: subscription.tweetsAllowed,
      tweetsPosted: subscription.tweetsPosted,
      tweetsRemaining: tweetsRemaining,
      canTweet: tweetsRemaining > 0 || subscription.tweetsAllowed === -1,
      validUntil: subscription.validUntil
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment tweet count
router.patch("/increment-tweet/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({ 
      user: userId, 
      status: "active" 
    });

    if (subscription && subscription.tweetsAllowed !== -1) {
      subscription.tweetsPosted += 1;
      await subscription.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current subscription
router.get("/current/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({ 
      user: userId 
    }).populate('user');

    if (!subscription) {
      return res.json({ plan: "free" });
    }

    res.json({
      plan: subscription.plan,
      status: subscription.status,
      tweetsAllowed: subscription.tweetsAllowed,
      tweetsPosted: subscription.tweetsPosted,
      validUntil: subscription.validUntil
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plans
router.get("/plans", (req, res) => {
  res.json(plans);
});

export default router;