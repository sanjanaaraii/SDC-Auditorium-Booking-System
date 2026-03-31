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

    
      if (!auditoriumId || !eventId || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({
          message: "Auditorium ID, event ID and seats are required"
        });
      }

      if (!mongoose.Types.ObjectId.isValid(auditoriumId)) {
        return res.status(400).json({ message: "Invalid auditorium ID" });
      }


      const eventBooking = await Booking.findById(eventId);

      if (!eventBooking) {
        return res.status(404).json({ message: "Event not found" });
      }

      const auditorium = await Auditorium.findById(auditoriumId);
      if (!auditorium) {
        return res.status(404).json({ message: "Auditorium not found" });
      }

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

      //  🚨 CHECK TIME CONFLICT (DIFFERENT EVENTS)
      const conflictingBooking = await Booking.findOne({
        user: req.user._id,
        bookingType: "SEAT",
        status: { $ne: "Cancelled" },

        date: eventBooking.date,

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