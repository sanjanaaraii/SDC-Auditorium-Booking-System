import express from "express";
import Auditorium from "../../models/auditorium.js";
import { authorize } from "../../middleware/authorize.js";
import { authenticate } from "../../middleware/authmiddleware.js";


const router = express.Router();

// Create new auditorium
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, location, capacity, facilities } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: "Name and capacity are required" });
    }

    const newAuditorium = new Auditorium({
      name,
      location,
      capacity,
      facilities: facilities || []
    });

    await newAuditorium.save();
    res.status(201).json({ message: "Auditorium created successfully", auditorium: newAuditorium });
  } catch (err) {
    console.error("Error creating auditorium:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update auditorium
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, location, capacity, facilities } = req.body;

    const auditorium = await Auditorium.findById(req.params.id);
    if (!auditorium) {
      return res.status(404).json({ message: "Auditorium not found" });
    }

    if (name) auditorium.name = name;
    if (location !== undefined) auditorium.location = location;
    if (capacity) auditorium.capacity = capacity;
    if (facilities !== undefined) auditorium.facilities = facilities;

    await auditorium.save();
    res.json({ message: "Auditorium updated successfully", auditorium });
  } catch (err) {
    console.error("Error updating auditorium:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete auditorium
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const auditorium = await Auditorium.findByIdAndDelete(req.params.id);
    
    if (!auditorium) {
      return res.status(404).json({ message: "Auditorium not found" });
    }

    res.json({ message: "Auditorium deleted successfully" });
  } catch (err) {
    console.error("Error deleting auditorium:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all auditoriums (admin view with stats)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const auditoriums = await Auditorium.find().sort({ createdAt: -1 });
    res.json(auditoriums);
  } catch (err) {
    console.error("Error fetching auditoriums:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;