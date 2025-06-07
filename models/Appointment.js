const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorEmail: { type: String, required: true },
  date: { type: String, required: true },
  day: { type: String, required: true },
  timeSlot: { type: String, required: true },
  price: { type: Number, default: 0 },
  isBooked: { type: Boolean, default: false },
  bookedBy: {
    name: String,
    email: String,
  },
  bookedByEmail: { type: String, default: "" }, // for easy lookup
});

module.exports = mongoose.model("Appointment", appointmentSchema);
