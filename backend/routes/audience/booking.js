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
      // ✅ 1. EXTRACT FIRST (VERY IMPORTANT)
      const { auditoriumId, seats, eventId } = req.body;

      // ✅ 2. VALIDATION
      if (!auditoriumId || !eventId || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({
          message: "Auditorium ID, event ID and seats are required"
        });
      }

      if (!mongoose.Types.ObjectId.isValid(auditoriumId)) {
        return res.status(400).json({ message: "Invalid auditorium ID" });
      }

      // ✅ 3. FETCH EVENT (this is actually a Booking of type EVENT)
      const eventBooking = await Booking.findById(eventId);

      if (!eventBooking) {
        return res.status(404).json({ message: "Event not found" });
      }

      // ✅ 4. CHECK AUDITORIUM
      const auditorium = await Auditorium.findById(auditoriumId);
      if (!auditorium) {
        return res.status(404).json({ message: "Auditorium not found" });
      }

      // ✅ 5. CHECK SAME EVENT DUPLICATE
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

      // ✅ 6. 🚨 CHECK TIME CONFLICT (DIFFERENT EVENTS)
      const conflictingBooking = await Booking.findOne({
        user: req.user._id,
        bookingType: "SEAT",
        status: { $ne: "Cancelled" },

        // match same date
        date: eventBooking.date,

        // overlap logic
        $or: [
          {
            startTime: { $lt: eventBooking.endTime },
            endTime: { $gt: eventBooking.startTime }
          }
        ]
      });

      if (conflictingBooking) {
        return res.status(409).json({
          message: "You already have another booking at this time"
        });
      }

      // ✅ 7. CHECK SEAT CONFLICT
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

      // ⚠️ IMPORTANT: copy event timing into seat booking
      const booking = new Booking({
        user: req.user._id,
        auditorium: auditoriumId,
        eventId: eventId,
        seats,
        bookingType: "SEAT",
        date: eventBooking.date,
        startTime: eventBooking.startTime,
        endTime: eventBooking.endTime,
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
        .populate("eventId", "_id eventName date startTime endTime")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (err) {
      console.error("Fetch audience bookings error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;