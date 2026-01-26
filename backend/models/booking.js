import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      enum: ["EVENT", "SEAT"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    auditorium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auditorium",
      required: true,
    },

    eventName: {
      type: String,
      required: function () {
        return this.bookingType === "EVENT";
      },
    },
    description: { type: String },
    date: {
      type: Date,
      required: function () {
        return this.bookingType === "EVENT";
      },
    },
    startTime: {
      type: String,
      required: function () {
        return this.bookingType === "EVENT";
      },
    },
    endTime: {
      type: String,
      required: function () {
        return this.bookingType === "EVENT";
      },
    },

    seats: {
      type: [String],
      required: function () {
        return this.bookingType === "SEAT";
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { auditorium: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: false }
);

// ✅ SAFE MODEL EXPORT
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
