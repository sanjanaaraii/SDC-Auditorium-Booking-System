import mongoose from "mongoose";

const auditoriumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    capacity: { type: Number, required: true },
    facilities: [{ type: String }],
  },
  { timestamps: true }
);

// ✅ SAFE MODEL EXPORT (IMPORTANT)
const Auditorium =
  mongoose.models.Auditorium ||
  mongoose.model("Auditorium", auditoriumSchema);

export default Auditorium;
