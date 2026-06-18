import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { OTPPool } from "@/models/OTPPool";
import { sendEmail } from "@/utils/mailService";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { slotType, price, email, userId } = await req.json();
    await dbConnect();

    // 1. Fetch one unused OTP for this slot type
    let otpRecord = await OTPPool.findOneAndUpdate(
      { slotType, isUsed: false },
      { isUsed: true },
      { new: true }
    );

    if (!otpRecord) {
      // Auto-recycle OTPs for this slot type when they run out
      await OTPPool.updateMany({ slotType }, { isUsed: false });
      otpRecord = await OTPPool.findOneAndUpdate(
        { slotType, isUsed: false },
        { isUsed: true },
        { new: true }
      );
    }

    if (!otpRecord) {
      // Fallback: If OTPPool is completely empty in the DB, generate a new one
      const prefixes: Record<string, string> = {
        "15min": "115",
        "30min": "230",
        "45min": "345",
        "60min": "460"
      };
      const prefix = prefixes[slotType] || "999";
      const fallbackOtp = `${prefix}${Math.floor(100 + Math.random() * 900)}`;
      
      otpRecord = await OTPPool.create({
        slotType,
        otp: fallbackOtp,
        isUsed: true
      });
    }

    // 2. Create Booking
    const booking = await Booking.create({
      userId,
      slotType,
      price,
      otp: otpRecord.otp,
      status: "pending",
    });

    // 3. Send Email bypassed for guest sessions

    return NextResponse.json({ 
      message: "Booking successful and OTP sent!", 
      booking 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
