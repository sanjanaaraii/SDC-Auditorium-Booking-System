import express from "express";
import User from "../../models/user.js";
import Booking from "../../models/booking.js";
import { authenticate } from "../../middleware/authmiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";

const router = express.Router();

// Get all users
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    // Get booking count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingCount
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user details
router.get("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ user: user._id })
      .populate('auditorium', 'name location')
      .sort({ date: -1 });

    res.json({
      user,
      bookings
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role
router.patch("/:id/role", authenticate, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'user'" });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role === 'user') {
      return res.status(400).json({ message: "You cannot demote yourself" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Delete user's bookings
    await Booking.deleteMany({ user: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and associated bookings deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user statistics
router.get("/stats/overview", authenticate, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    res.json({
      total: totalUsers,
      admins: adminUsers,
      users: regularUsers
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router