import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingLogin extends Document {
  userId: string;
  email: string;
  status: 'pending' | 'approved' | 'declined';
  requestedAt: Date;
  processedAt?: Date;
}

const PendingLoginSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
});

export default mongoose.models.PendingLogin || mongoose.model<IPendingLogin>('PendingLogin', PendingLoginSchema);