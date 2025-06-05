// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const sendMail = require("../utils/sendMail");

exports.createAppointment = async (req, res) => {
  try {
    const { doctorEmail, date, day, timeSlot, price } = req.body;
    const appointment = new Appointment({ doctorEmail, date, day, timeSlot, price });
    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ isBooked: false });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { appointmentId, userEmail } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || appointment.isBooked) {
      return res.status(400).json({ message: "Appointment not available" });
    }

    appointment.isBooked = true;
    appointment.bookedBy = userEmail;
    await appointment.save();

    // Send email to user and doctor
    await sendMail(userEmail, "Appointment Confirmed", `You have booked an appointment with ${appointment.doctorEmail} on ${appointment.date} at ${appointment.timeSlot}.`);
    await sendMail(appointment.doctorEmail, "Appointment Booked", `An appointment has been booked by ${userEmail} on ${appointment.date} at ${appointment.timeSlot}.`);

    res.json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
