import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { OTPPool } from "@/models/OTPPool";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    // 1. Clear database
    await User.deleteMany({});
    await Booking.deleteMany({});
    await OTPPool.deleteMany({});

    // 2. Create Dummy Users
    const hashedPwd = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
      { name: "Suhas Patil", email: "suhas@parikrama.edu", password: hashedPwd, role: "user" },
      { name: "Anjali Deshmukh", email: "anjali@parikrama.edu", password: hashedPwd, role: "user" },
      { name: "Prof. Kadam", email: "kadam@parikrama.edu", password: hashedPwd, role: "user" },
      { name: "Rahul Verma", email: "rahul@parikrama.edu", password: hashedPwd, role: "user" }
    ]);

    // 3. Create Dummy Bookings
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await Booking.insertMany([
      { userId: users[0]._id, slotType: "30min", price: 60, otp: "AX89P2", status: "completed", createdAt: yesterday },
      { userId: users[1]._id, slotType: "60min", price: 120, otp: "MM91K4", status: "completed", createdAt: yesterday },
      { userId: users[2]._id, slotType: "15min", price: 30, otp: "ZN55L1", status: "pending", createdAt: today },
      { userId: users[3]._id, slotType: "45min", price: 90, otp: "QR44V9", status: "pending", createdAt: today },
      { userId: users[0]._id, slotType: "30min", price: 60, otp: "BB88H7", status: "completed", createdAt: today }
    ]);

    // 4. Generate OTP Pool Data (50 OTPs across diff types)
    const slotTypes = ["15min", "30min", "45min", "60min"];
    const otpDocs = [];
    
    for (let i = 0; i < 50; i++) {
        // Random 6-char OTP
        const randomOtp = Math.random().toString(36).substring(2, 8).toUpperCase();
        // Random slot type
        const randomSlot = slotTypes[Math.floor(Math.random() * slotTypes.length)];
        // First 10 are used, rest are unused
        otpDocs.push({
            slotType: randomSlot,
            otp: randomOtp,
            isUsed: i < 10 
        });
    }

    await OTPPool.insertMany(otpDocs);

    return NextResponse.json({ 
        message: "Atlas Database successfully seeded! 🎉",
        usersCreated: 4,
        bookingsCreated: 5,
        otpsCreated: 50
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
