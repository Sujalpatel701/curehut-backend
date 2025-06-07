const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");
const Doctor = require("../models/doctorModel"); // ✅ Correctly imported


const EMAIL = process.env.EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorEmail, date, day, timeSlot, price } = req.body;
    const appointment = new Appointment({ doctorEmail, date, day, timeSlot, price });
    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error creating appointment", error: err.message });
  }
};

// Get all available appointments
exports.getAvailableAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ isBooked: false });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  const { appointmentId, userName, userEmail } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.isBooked) return res.status(400).json({ message: "Appointment already booked" });

    appointment.isBooked = true;
    appointment.bookedBy = { name: userName, email: userEmail };
    appointment.bookedByEmail = userEmail;
    await appointment.save();

    // Email notifications
    const mailOptionsUser = {
      from: EMAIL,
      to: userEmail,
      subject: "Appointment Confirmation - CureHut",
      html: `<h3>Hi ${userName},</h3>
             <p>Your appointment with <strong>${appointment.doctorEmail}</strong> has been confirmed for <strong>${appointment.date}</strong> at <strong>${appointment.timeSlot}</strong>.</p>
             <p>Charges: ₹${appointment.price}</p>
             <p>Thank you for using CureHut!</p>`,
    };

    const mailOptionsDoctor = {
      from: EMAIL,
      to: appointment.doctorEmail,
      subject: "New Appointment Booked - CureHut",
      html: `<h3>Doctor,</h3>
             <p><strong>${userName}</strong> (${userEmail}) has booked an appointment on <strong>${appointment.date}</strong> at <strong>${appointment.timeSlot}</strong>.</p>
             <p>Please be ready for the consultation.</p>`,
    };

    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsDoctor);

    res.json({ message: "Appointment booked and confirmation sent." });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment", error: err.message });
  }
};

// New: Get all appointments for a doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorEmail = req.params.email;
    const appointments = await Appointment.find({
      doctorEmail,
      isBooked: true,
    });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor appointments" });
  }
};

// controllers/appointmentController.js
exports.getUserAppointments = async (req, res) => {
  try {
    const userEmail = req.params.email;

    const appointments = await Appointment.find({
      bookedByEmail: userEmail,
      isBooked: true,
    });

    const appointmentsWithDoctor = await Promise.all(
      appointments.map(async (appt) => {
        const doctor = await Doctor.findOne({ email: appt.doctorEmail });

        return {
          ...appt.toObject(),
          doctorDetails: doctor
            ? {
                name: doctor.name,
                specialization: doctor.specialization,
                hospital: doctor.hospital, // ✅ hospital added
                email: doctor.email,
              }
            : null,
        };
      })
    );

    res.json({ appointments: appointmentsWithDoctor });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user appointments", error: err.message });
  }
};
