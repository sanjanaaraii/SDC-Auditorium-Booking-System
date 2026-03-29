import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../../middleware/authmiddleware.js";
import { authorize } from "../../middleware/authorize.js";
import Booking from "../../models/booking.js";
import Auditorium from "../../models/auditorium.js";

const router = express.Router();

// CREATE SEAT BOOKING
router.post(
  "/",
  authenticate,
  authorize("audience"),
  async (req, res) => {
    try {
      const { auditoriumId, seats, eventId } = req.body;

      //  validation
      if (!auditoriumId || !eventId || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({
          message: "Auditorium ID, event ID and seats are required"
        });
      }

      // validate auditorium ID
      if (!mongoose.Types.ObjectId.isValid(auditoriumId)) {
        return res.status(400).json({ message: "Invalid auditorium ID" });
      }

      const auditorium = await Auditorium.findById(auditoriumId);
      if (!auditorium) {
        return res.status(404).json({ message: "Auditorium not found" });
      }

      //  check if user already booked THIS event
      const alreadyBooked = await Booking.findOne({
        user: req.user._id,
        eventId: eventId,
        bookingType: "SEAT",
        status: { $ne: "Cancelled" }
      });

      if (alreadyBooked) {
        return res.status(400).json({
          message: "You already booked this event"
        });
      }

      //  check seat conflicts (same event only)
      const existingBookings = await Booking.find({
        eventId: eventId, 
        seats: { $in: seats },
        status: { $ne: "Cancelled" }
      });

      if (existingBookings.length > 0) {
        return res.status(409).json({
          message: "One or more seats already booked"
        });
      }

      //  create booking
      const booking = new Booking({
        user: req.user._id,
        auditorium: auditoriumId,
        eventId: eventId, 
        seats,
        bookingType: "SEAT",
        status: "Confirmed"
      });

      await booking.save();

      res.status(201).json({
        message: "Booking successful",
        booking
      });

    } catch (err) {
      console.error("Audience booking error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET MY BOOKINGS
router.get(
  "/my",
  authenticate,
  authorize("audience"),
  async (req, res) => {
    try {
      const bookings = await Booking.find({
        user: req.user._id,
        bookingType: "SEAT"
      })
        .populate("auditorium", "name location")
        .populate("eventId", "_id eventName")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (err) {
      console.error("Fetch audience bookings error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;