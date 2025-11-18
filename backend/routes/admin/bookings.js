// backend/routes/admin/bookings.js

import express from "express";
import Booking from "../../models/booking.js"; // Note: ../../ models
import { authenticate } from "../../middleware/authmiddleware.js"; // Note: ../../ middleware
import adminMiddleware from "../../middleware/adminMiddleware.js"; // Note: ../../ middleware

const router = express.Router();

// GET /api/admin/bookings/all
// This matches the fetch request from your component
router.get("/all", authenticate, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('auditorium', 'name location')
      .populate('user', 'name email') // Also populate user info
      .sort({ date: 'desc' });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/admin/bookings/:id/status
// This matches the handleStatusUpdate function in your component
router.patch("/:id/status", authenticate, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    
    booking.status = status;
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('auditorium', 'name location')
      .populate('user', 'name email');
        
    res.json(populatedBooking);

  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;