import express from "express";
import Auditorium from "../models/auditorium.js";
import { authenticate } from "../middleware/authmiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js"; // <-- Import admin middleware

const router = express.Router();

// GET /
// Fetches all auditoriums (for all authenticated users)
router.get("/", authenticate, async (req, res) => {
  try {
    let auditoriums = await Auditorium.find();
    if (auditoriums.length === 0) {
      // Dummy data logic
      const dummyAuditoriums = [
        { name: "Main Hall", location: "Block A, Ground Floor", capacity: 500, facilities: ["Projector", "AC", "Sound System"] },
        { name: "Seminar Hall 1", location: "Block B, First Floor", capacity: 150, facilities: ["Projector", "Whiteboard"] },
        { name: "Mini Theatre", location: "Block C, Second Floor", capacity: 80, facilities: ["Projector", "AC"] },
      ];
      await Auditorium.insertMany(dummyAuditoriums);
      auditoriums = await Auditorium.find();
    }
    res.json(auditoriums);
  } catch (err) {
    console.error("Error fetching auditoriums:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === ADD THIS NEW POST ROUTE ===
// POST /
// Creates a new auditorium (Admin Only)
router.post("/", authenticate, adminMiddleware, async (req, res) => {
  try {
    const { name, location, capacity, facilities } = req.body;

    if (!name || !location || !capacity) {
      return res.status(400).json({ message: "Name, location, and capacity are required." });
    }

    const newAuditorium = new Auditorium({
      name,
      location,
      capacity,
      facilities: facilities || [] // Default to empty array if facilities not provided
    });

    await newAuditorium.save();
    res.status(201).json(newAuditorium);

  } catch (err) {
    console.error("Error creating auditorium:", err);
    if (err.code === 11000) { // Duplicate key error
        return res.status(409).json({ message: "An auditorium with this name already exists." });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;