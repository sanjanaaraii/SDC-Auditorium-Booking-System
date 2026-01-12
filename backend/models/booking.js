import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      enum: ["EVENT", "SEAT"],
      required: true
    },

    // Common
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    auditorium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auditorium",
      required: true
    },

    // EVENT booking (organizer)
    eventName: {
      type: String,
      required: function () {
        return this.bookingType === "EVENT";
      }
    },
    description: { type: String },
    date: {
      type: Date,
      required: function () {
        return this.bookingType === "EVENT";
      }
    },
    startTime: {
      type: String,
      required: function () {
        return this.bookingType === "EVENT";
      }
    },
    endTime: {
      type: String,
      required: function () {
        return this.bookingType === "EVENT";
      }
    },

    // SEAT booking (audience)
    seats: {
      type: [String],
      required: function () {
        return this.bookingType === "SEAT";
      }
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Confirmed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

// index for event overlap checks
bookingSchema.index(
  { auditorium: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: false }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
