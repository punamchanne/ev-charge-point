require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Pure Mongoose Schemas (so we don't need Next.js environment)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  slotType: { type: String, enum: ["15min", "30min", "45min", "60min"], required: true },
  price: { type: Number, required: true },
  otp: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });

const otpPoolSchema = new mongoose.Schema({
  slotType: { type: String, enum: ["15min", "30min", "45min", "60min"], required: true },
  otp: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
}, { timestamps: true });

const SeedUser = mongoose.models.User || mongoose.model("User", userSchema);
const SeedBooking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const SeedOTPPool = mongoose.models.OTPPool || mongoose.model("OTPPool", otpPoolSchema);

async function seedDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGODB_URI is missing in .env file");

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI, { family: 4 });
    console.log("Connected Successfully! 🌱");

    console.log("1/4 Clearing old data...");
    await SeedUser.deleteMany({});
    await SeedBooking.deleteMany({});
    await SeedOTPPool.deleteMany({});

    console.log("2/4 Creating Dummy Users...");
    const hashedPwd = await bcrypt.hash("password123", 10);
    const users = await SeedUser.insertMany([
      { name: "Suhas Patil", email: "suhas@parikrama.edu", password: hashedPwd, role: "user" },
      { name: "Anjali Deshmukh", email: "anjali@parikrama.edu", password: hashedPwd, role: "user" },
      { name: "Prof. Kadam", email: "kadam@parikrama.edu", password: hashedPwd, role: "user" },
      { name: "Rahul Verma", email: "rahul@parikrama.edu", password: hashedPwd, role: "user" }
    ]);

    console.log("3/4 Creating Bookings...");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await SeedBooking.insertMany([
      { userId: users[0]._id, slotType: "30min", price: 60, otp: "AX89P2", status: "completed", createdAt: yesterday },
      { userId: users[1]._id, slotType: "60min", price: 120, otp: "MM91K4", status: "completed", createdAt: yesterday },
      { userId: users[2]._id, slotType: "15min", price: 30, otp: "ZN55L1", status: "pending", createdAt: today },
      { userId: users[3]._id, slotType: "45min", price: 90, otp: "QR44V9", status: "pending", createdAt: today },
      { userId: users[0]._id, slotType: "30min", price: 60, otp: "BB88H7", status: "completed", createdAt: today }
    ]);

    console.log("4/4 Generating Random OTPs...");
    const slotTypes = ["15min", "30min", "45min", "60min"];
    const otpDocs = [];
    for (let i = 0; i < 50; i++) {
        otpDocs.push({
            slotType: slotTypes[Math.floor(Math.random() * slotTypes.length)],
            otp: Math.random().toString(36).substring(2, 8).toUpperCase(),
            isUsed: i < 10 
        });
    }
    await SeedOTPPool.insertMany(otpDocs);

    console.log("✅ Database Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error During Seeding:", error);
    process.exit(1);
  }
}

seedDB();
