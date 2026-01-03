import express from "express";
import Booking from "../../models/booking.js";
import { authenticate } from "../../middleware/authmiddleware.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("audience"),
  async (req, res) => {
    try {
      const events = await Booking.find({
        status: "Approved"
      })
        .populate("auditorium", "name location")
        .populate("user", "name email")
        .sort({ date: 1 });

      res.status(200).json(events);
    } catch (err) {
      console.error("Audience events error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;

