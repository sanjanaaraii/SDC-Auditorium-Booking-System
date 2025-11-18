import express from "express";
import Booking from "../../models/booking.js";
import { authenticate } from "../../middleware/authmiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router(); // <<< YOU FORGOT THIS

// GET /api/admin/bookings/all
router.get("/all", authenticate, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("auditorium", "name location")
      .populate("user", "name email")
      .sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/:id/status", authenticate, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected", "Pending", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("auditorium", "name location")
      .populate("user", "name email");

    res.json({ message: "Status updated", booking: updated });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
