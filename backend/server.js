

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
import audienceBookingRoutes from "./routes/audience/booking.js";

import audienceEventsRoutes from "./routes/audience/events.js";
import audienceOrganizerRequestRoutes from "./routes/audience/organizerRequest.js";
import adminOrganizerRequestRoutes from "./routes/admin/organizerRequests.js";
import adminStatsRoutes from "./routes/admin/stats.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/audience/bookings", audienceBookingRoutes);
app.use("/api/audience/events", audienceEventsRoutes);
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


app.use("/api/admin", adminStatsRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Audience organizer request
app.use(
  "/api/audience/organizerRequest",
  audienceOrganizerRequestRoutes
);

// Admin organizer requests
app.use(
  "/api/admin/organizer-requests",
  adminOrganizerRequestRoutes
);
