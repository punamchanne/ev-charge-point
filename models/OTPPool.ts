import mongoose, { Schema, model, models } from "mongoose";

const OTPPoolSchema = new Schema(
  {
    slotType: { 
      type: String, 
      enum: ["15min", "30min", "45min", "60min"], 
      required: true 
    },
    otp: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OTPPoolModel = models.OTPPool || model("OTPPool", OTPPoolSchema);
export { OTPPoolModel as OTPPool };
export default OTPPoolModel;
