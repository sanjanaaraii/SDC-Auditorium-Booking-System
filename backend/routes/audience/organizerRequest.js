import express from "express";
import OrganizerRequest from "../../models/OrganizerRequest.js";
import { authenticate } from "../../middleware/authmiddleware.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// SUBMIT ORGANIZER REQUEST (AUDIENCE)
router.post(
  "/",
  authenticate,
  authorize("audience"),
  async (req, res) => {
    try {
      const { eventName, reason } = req.body;

      if (!eventName || !reason) {
        return res.status(400).json({
          message: "Event name and reason are required"
        });
      }

      // prevent duplicate pending requests
      const existingRequest = await OrganizerRequest.findOne({
        user: req.user._id,
        status: "pending"
      });

      if (existingRequest) {
        return res.status(409).json({
          message: "You already have a pending organizer request"
        });
      }

      const request = new OrganizerRequest({
        user: req.user._id,
        eventName,
        reason
      });

      await request.save();

      res.status(201).json({
        message: "Organizer request submitted successfully",
        request
      });
    } catch (err) {
      console.error("Organizer request error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
