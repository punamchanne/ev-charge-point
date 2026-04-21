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
    const otpRecord = await OTPPool.findOneAndUpdate(
      { slotType, isUsed: false },
      { isUsed: true },
      { new: true }
    );

    if (!otpRecord) {
      return NextResponse.json({ error: "No OTPs available for this slot. Please contact admin." }, { status: 400 });
    }

    // 2. Create Booking
    const booking = await Booking.create({
      userId,
      slotType,
      price,
      otp: otpRecord.otp,
      status: "pending",
    });

    // 3. Send Email
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981; text-align: center;">EV Charging OTP</h2>
        <p>Thank you for choosing <strong>Parikrama EV Charging Station</strong>.</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 14px; color: #666; display: block; margin-bottom: 5px;">YOUR OTP FOR ${slotType.toUpperCase()}</span>
          <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #065f46;">${otpRecord.otp}</h1>
        </div>
        <p><strong>Booking Details:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li><b>Slot:</b> ${slotType}</li>
          <li><b>Price:</b> ₹${price}</li>
          <li><b>Booking ID:</b> ${booking._id}</li>
        </ul>
        <p style="font-size: 12px; color: #999; text-align: center;">Please use this OTP at the charging station interface.</p>
      </div>
    `;

    await sendEmail(email, "Your EV Charging OTP - Parikrama College", emailHtml);

    return NextResponse.json({ 
      message: "Booking successful and OTP sent!", 
      booking 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
