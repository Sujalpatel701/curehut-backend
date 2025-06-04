const express = require("express");
const router = express.Router();
const doctorCtrl = require("../controllers/doctorController");

// Doctor Auth
router.post("/auth/doctor/signup", doctorCtrl.signup);
router.post("/auth/doctor/verify", doctorCtrl.verifyOtp);
router.post("/auth/doctor/login", doctorCtrl.login);

// Doctor Details
router.get("/doctors", doctorCtrl.getAllDoctors);
router.get("/doctor/:email", doctorCtrl.getDoctorByEmail);

module.exports = router;
