import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slotType: { 
      type: String, 
      enum: ["15min", "30min", "45min", "60min"], 
      required: true 
    },
    price: { type: Number, required: true },
    otp: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
);

const Booking = models.Booking || model("Booking", BookingSchema);
export { Booking };
export default Booking;
