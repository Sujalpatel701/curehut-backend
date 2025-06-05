const Article = require("../models/Article");

exports.createArticle = async (req, res) => {
  try {
    const { title, content, doctorEmail } = req.body;
    const imagePaths = req.files?.map((file) => file.filename) || [];

    if (!title || !content || !doctorEmail) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newArticle = new Article({
      title,
      content,
      doctorEmail,
      images: imagePaths,
    });

    await newArticle.save();
    res.status(201).json({ message: "Article created", article: newArticle });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

exports.getArticlesByDoctor = async (req, res) => {
  try {
    const { email } = req.params;
    const articles = await Article.find({ doctorEmail: email }).sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor's articles" });
  }
};
