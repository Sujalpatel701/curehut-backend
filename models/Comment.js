const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  email: String,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  email: { type: String, required: true },
  name: { type: String, required: true }, // <== ADD THIS
  text: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  replies: [replySchema], // <== ADD THIS
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
