// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const appointmentCtrl = require("../controllers/appointmentController");

router.post("/appointments", appointmentCtrl.createAppointment);
router.get("/appointments", appointmentCtrl.getAvailableAppointments);
router.post("/appointments/book", appointmentCtrl.bookAppointment);

module.exports = router;
