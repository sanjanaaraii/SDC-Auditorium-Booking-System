

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// User routes
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import auditoriumRoutes from "./routes/auditoriums.js";
// Admin routes
import adminAuditoriumRoutes from "./routes/admin/auditoriums.js";
import adminBookingRoutes from "./routes/admin/bookings.js";
import adminUserRoutes from "./routes/admin/users.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo connection error:", err));

// User routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auditoriums", auditoriumRoutes);


// Admin routes
app.use("/api/admin/auditoriums", adminAuditoriumRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/users", adminUserRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));