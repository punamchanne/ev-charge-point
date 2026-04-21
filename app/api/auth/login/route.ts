import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check for hardcoded admin
    if (email === "admin@parikrama.edu" && password === "admin123") {
      const token = jwt.sign(
        { email, role: "admin", name: "Admin" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      
      const response = NextResponse.json({ 
        message: "Admin Login successful", 
        user: { name: "Admin", email, role: "admin" } 
      });
      
      response.cookies.set("token", token, { httpOnly: true, path: "/" });
      return response;
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ 
      message: "Login successful", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
    
    response.cookies.set("token", token, { httpOnly: true, path: "/" });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
