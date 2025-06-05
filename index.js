const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
const geminiRoutes = require("./routes/geminiRoutes");
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const articleRoutes = require("./routes/articleRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use("/api", appointmentRoutes);
app.use("/uploads", express.static("uploads")); // To serve image files
app.use("/api", articleRoutes);
app.use("/api", doctorRoutes);
app.use("/api", geminiRoutes);
app.use("/api/auth", authRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
