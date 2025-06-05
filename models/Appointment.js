// models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorEmail: { type: String, required: true },
  date: { type: String, required: true }, // e.g., "2025-06-10"
  day: { type: String, required: true },  // e.g., "Monday"
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
  price: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String }, // user's email
});

module.exports = mongoose.model("Appointment", appointmentSchema);
