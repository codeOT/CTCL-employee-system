// models/Users.ts - Add this field to your existing model
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
  passwordChangedAt: Date;
  loginApproved: boolean;   
  approvalPending: boolean;
  approvedAt?: Date;
  declinedAt?: Date;
  lastLoginAttempt?: Date;  // Add this if not already present
  lastLogout?: Date;        // Add this new field
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: "admin" },
    passwordChangedAt: { type: Date, default: Date.now },

    loginApproved: { type: Boolean, default: false },
    approvalPending: { type: Boolean, default: false },
    approvedAt: { type: Date }, 
    declinedAt: { type: Date },
    lastLoginAttempt: { type: Date }, 
    lastLogout: { type: Date },        
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);