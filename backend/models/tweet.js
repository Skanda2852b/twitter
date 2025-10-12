import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  retweets: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  retweetedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String, default: null },
  audio: { type: String, default: null },
  audioDuration: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const Tweet = mongoose.model("Tweet", TweetSchema);
export default Tweet;