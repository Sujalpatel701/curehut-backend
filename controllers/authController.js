const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/sendOTP");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { name, phone, email, password, insuranceCompany, insuranceId } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      insuranceCompany,
      insuranceId,
      otp,
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: "OTP sent to email. Verify to complete registration." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", error });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

    user.isVerified = true;
    user.otp = null;
    await user.save();
    res.json({ message: "Email verified successfully." });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed.", error: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ message: "User not verified or not found." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials." });

    res.json({ message: "Login successful.", user });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err });
  }
};

exports.getAllUsers = async (_, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
};
