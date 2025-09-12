import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please set MONGODB_URI in .env");

  await mongoose.connect(uri);
  isConnected = true;
}
