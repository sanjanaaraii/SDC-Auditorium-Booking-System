import express from "express";
import User from "../../models/User.js";
import Booking from "../../models/Booking.js";
import Auditorium from "../../models/Auditorium.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const bookings = await Booking.countDocuments();
    const auditoriums = await Auditorium.countDocuments();

    res.json({
      users,
      bookings,
      auditoriums,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

export default router;
