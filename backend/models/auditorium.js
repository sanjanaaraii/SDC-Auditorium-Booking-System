import mongoose from "mongoose";

const auditoriumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  capacity: { type: Number, required: true },
  facilities: [{ type: String }] // e.g., ["Projector", "AC"]
}, { timestamps: true });

const Auditorium = mongoose.model("Auditorium", auditoriumSchema);
export default Auditorium;
