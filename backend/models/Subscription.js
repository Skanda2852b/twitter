import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { 
    type: String, 
    enum: ["free", "bronze", "silver", "gold"], 
    default: "free" 
  },
  status: { 
    type: String, 
    enum: ["active", "inactive", "cancelled"], 
    default: "active" 
  },
  tweetsAllowed: { type: Number, default: 1 },
  tweetsPosted: { type: Number, default: 0 },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
  paymentId: { type: String },
  invoiceUrl: { type: String },
  lastReset: { type: Date, default: Date.now }
});

// Reset tweet count monthly
SubscriptionSchema.methods.resetTweetCount = function() {
  const now = new Date();
  const lastReset = new Date(this.lastReset);
  const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                    (now.getMonth() - lastReset.getMonth());
  
  if (monthsDiff >= 1) {
    this.tweetsPosted = 0;
    this.lastReset = now;
  }
};

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;