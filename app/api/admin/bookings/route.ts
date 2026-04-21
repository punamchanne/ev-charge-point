import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find({}).populate("userId", "email name").sort({ createdAt: -1 }).lean();
    const formattedBookings = bookings.map((b: any) => ({
      _id: b._id,
      userId: b.userId?._id?.toString() || b.userId?.toString() || "Unknown",
      email: b.userId?.email || "Unknown User",
      slotType: b.slotType,
      price: b.price,
      otp: b.otp,
      status: b.status,
      createdAt: b.createdAt
    }));
    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
