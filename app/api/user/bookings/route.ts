import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await dbConnect();
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
