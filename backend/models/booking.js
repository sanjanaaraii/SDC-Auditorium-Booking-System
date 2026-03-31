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

    // EVENT DETAILS (for EVENT type)
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

    // SEAT BOOKING
    seats: {
      type: [String],
      required: function () {
        return this.bookingType === "SEAT";
      },
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
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

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;