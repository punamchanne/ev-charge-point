import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { OTPPool } from "@/models/OTPPool";

export async function GET() {
  try {
    await dbConnect();

    // Clear existing OTPs to refresh the pool
    await OTPPool.deleteMany({});

    const slotConfig = [
      { type: "15min", prefix: "115" },
      { type: "30min", prefix: "230" },
      { type: "45min", prefix: "345" },
      { type: "60min", prefix: "460" },
    ];
    
    const totalSlots = 15; // Changed from 50 to 15 as requested
    const otps = [];

    for (const config of slotConfig) {
      for (let i = 1; i <= totalSlots; i++) {
        // Generates predictable OTPs: 115001, 115002... up to 15
        const otp = `${config.prefix}${i.toString().padStart(3, '0')}`;
        otps.push({
          slotType: config.type,
          otp,
          isUsed: false,
        });
      }
    }

    await OTPPool.insertMany(otps);

    return NextResponse.json({ 
      message: "OTP Pool refreshed with 15 fixed OTPs per slot", 
      count: otps.length,
      sample: otps.slice(0, 3) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
