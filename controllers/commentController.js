const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { articleId, email, name, text, stars } = req.body;

    if (!articleId || !email || !name || !text || !stars) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newComment = new Comment({ articleId, email, name, text, stars });
    await newComment.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: "Error creating comment" });
  }
};


exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId }).sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};
exports.replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { email, name, text } = req.body;

    if (!email || !name || !text) {
      return res.status(400).json({ message: "All fields required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ email, name, text });
    await comment.save();

    res.status(200).json({ message: "Reply added", comment });
  } catch (err) {
    res.status(500).json({ message: "Error replying to comment" });
  }
};
