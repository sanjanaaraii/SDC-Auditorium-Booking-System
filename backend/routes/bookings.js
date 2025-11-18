import express from "express";
import Booking from "../models/booking.js";
import Auditorium from "../models/auditorium.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('auditorium', 'name location') 
      .sort({ date: 'desc' });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", authenticate, async (req, res) => {
  try {
    const { auditoriumId, eventName, description, date, startTime, endTime } = req.body;

    if (!auditoriumId || !eventName || !date || !startTime || !endTime) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

  
    const conflictingBooking = await Booking.findOne({
      auditorium: auditoriumId,
      date: new Date(date).setHours(0,0,0,0),
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({ message: "The selected time slot is already booked or pending." });
    }

    const newBooking = new Booking({
      auditorium: auditoriumId,
      user: req.user._id,
      eventName,
      description,
      date,
      startTime,
      endTime,
      status: "Pending"
    });
    await newBooking.save();
    const populatedBooking = await Booking.findById(newBooking._id).populate('auditorium', 'name location');
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating booking." });
  }
});


router.delete("/:id", authenticate, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or you don't have permission to cancel it." });
        }

        if (booking.status === 'Approved' || booking.status === 'Pending') {
            booking.status = 'Cancelled';
            await booking.save();
            return res.status(200).json({ message: "Booking cancelled successfully.", booking });
        } else {
            return res.status(400).json({ message: "This booking cannot be cancelled." });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;