import mongoose, { Schema, Document } from "mongoose";

export interface ILoginRequest extends Document {
  adminId: string;
  email: string;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
}

const LoginRequestSchema = new Schema<ILoginRequest>(
  {
    adminId: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.LoginRequest || mongoose.model<ILoginRequest>("LoginRequest", LoginRequestSchema);
