import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

export async function POST(req: Request) {
  try {
    const { otp, bookingId } = await req.json();
    await dbConnect();

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.otp === otp) {
      booking.status = "completed";
      await booking.save();
      return NextResponse.json({ message: "Charging Started" });
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
