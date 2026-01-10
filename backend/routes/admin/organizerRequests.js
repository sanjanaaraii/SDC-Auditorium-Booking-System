import express from "express";
import OrganizerRequest from "../../models/OrganizerRequest.js";
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

export default router;
