const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  getAllUsers,
  getUserById,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify", verifyOTP);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
module.exports = router;
