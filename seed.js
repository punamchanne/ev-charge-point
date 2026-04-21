require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const OTPPoolSchema = new mongoose.Schema({
  slotType: { type: String, required: true },
  otp: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
});

const OTPPool = mongoose.models.OTPPool || mongoose.model('OTPPool', OTPPoolSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    console.log("Clearing existing OTPs...");
    await OTPPool.deleteMany({});

    const slotConfig = [
      { type: "15min", prefix: "115" },
      { type: "30min", prefix: "230" },
      { type: "45min", prefix: "345" },
      { type: "60min", prefix: "460" },
    ];

    const otps = [];
    for (const config of slotConfig) {
      for (let i = 1; i <= 15; i++) {
        const otp = `${config.prefix}${i.toString().padStart(3, '0')}`;
        otps.push({
          slotType: config.type,
          otp,
          isUsed: false,
        });
      }
    }

    console.log(`Inserting ${otps.length} fixed OTPs...`);
    await OTPPool.insertMany(otps);
    console.log("DONE! Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
