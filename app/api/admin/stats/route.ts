import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { OTPPool } from "@/models/OTPPool";

export async function GET() {
  try {
    await dbConnect();

    const usersCount = await User.countDocuments({ role: "user" });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const otpStats = await OTPPool.aggregate([
      { $group: { _id: "$isUsed", count: { $sum: 1 } } }
    ]);

    const bookingBySlot = await Booking.aggregate([
      { $group: { _id: "$slotType", count: { $sum: 1 } } }
    ]);

    const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      totalUsers: usersCount,
      totalBookings,
      completedBookings,
      revenue: totalRevenue[0]?.total || 0,
      otpStats,
      bookingBySlot,
      recentBookings
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
