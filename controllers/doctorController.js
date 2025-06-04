const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const otpStore = new Map();
const nodemailer = require("nodemailer");

// Nodemailer setup using your env vars
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup - send OTP
exports.signup = async (req, res) => {
  const { name, email, password, phone, specialization, licenseNumber, hospital } = req.body;

  try {
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, { otp, data: { name, email, password: hashedPassword, phone, specialization, licenseNumber, hospital } });

    await transporter.sendMail({
      to: email,
      subject: "OTP Verification - CureHut",
      html: `<h3>Your OTP is: ${otp}</h3>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

// Verify OTP - create doctor
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ message: "OTP expired or invalid" });
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  try {
    const newDoctor = new Doctor(record.data);
    await newDoctor.save();
    otpStore.delete(email);

    res.status(201).json({ message: "Doctor registered", email: newDoctor.email });
  } catch (err) {
    res.status(500).json({ message: "Error saving doctor", error: err.message });
  }
};

// Login without JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful", email: doctor.email });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Get doctor by email
exports.getDoctorByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor", error: err.message });
  }
};
