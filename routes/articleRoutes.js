const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const articleCtrl = require("../controllers/articleController");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const commentCtrl = require("../controllers/commentController");

router.post("/comments", commentCtrl.createComment);
router.get("/comments/:articleId", commentCtrl.getCommentsByArticle);
router.post("/comments/:commentId/reply", commentCtrl.replyToComment); 

// Routes
router.post("/articles", upload.array("images", 5), articleCtrl.createArticle);
router.get("/articles", articleCtrl.getAllArticles);
router.get("/articles/doctor/:email", articleCtrl.getArticlesByDoctor);

module.exports = router;
