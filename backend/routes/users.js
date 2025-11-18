// backend/routes/users.js

import express from 'express';
import User from '../models/user.js';
import { authenticate } from '../middleware/authmiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// GET /api/users - Fetches all users (Admin Only)
router.get('/', authenticate, adminMiddleware, async (req, res) => {
  try {
    // Find all users, but select '-password' to exclude passwords from the response
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;