const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAvailableAppointments,
  bookAppointment,
  getDoctorAppointments,
  getUserAppointments,
} = require("../controllers/appointmentController");

router.post("/create", createAppointment);
router.get("/available", getAvailableAppointments);
router.post("/book", bookAppointment);

// ✅ NEW ROUTES
router.get("/doctor/app/:email", getDoctorAppointments);
router.get("/user/app/:email", getUserAppointments);

module.exports = router;
