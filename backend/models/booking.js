import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  auditorium: { type: mongoose.Schema.Types.ObjectId, ref: "Auditorium", required: true },
  eventName: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },   
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Cancelled"], default: "Pending" }
}, { timestamps: true });


bookingSchema.index({ auditorium: 1, date: 1, startTime: 1, endTime: 1 }, { unique: false });


const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
