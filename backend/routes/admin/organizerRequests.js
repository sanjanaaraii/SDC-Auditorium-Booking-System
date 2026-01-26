import express from "express";
import OrganizerRequest from "../../models/OrganizerRequest.js";
import User from "../../models/User.js";
import { authenticate } from "../../middleware/authmiddleware.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

// GET ALL ORGANIZER REQUESTS (ADMIN)
router.get(
  "/",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const requests = await OrganizerRequest
        .find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (err) {
      console.error("Admin organizer requests error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ UPDATE ORGANIZER REQUEST STATUS
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const request = await OrganizerRequest
        .findById(req.params.id)
        .populate("user");

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = status;
      await request.save();

      // 🔥 Promote user if approved
      if (status === "Approved") {
        request.user.role = "organizer";
        await request.user.save();
      }

      res.json({
        message: "Request updated successfully",
        request
      });
    } catch (err) {
      console.error("Update organizer request error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
