import mongoose, { Schema, Document } from 'mongoose';

export interface IDemand extends Document {
  buyer: mongoose.Types.ObjectId;
  cropType: string;
  quantityRequired: number;
  status: 'OPEN' | 'FULFILLED';
  createdAt: Date;
}

const demandSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cropType: { type: String, required: true },
  quantityRequired: { type: Number, required: true },
  status: { type: String, enum: ['OPEN', 'FULFILLED'], default: 'OPEN' }
}, { timestamps: true });

export default mongoose.model<IDemand>('Demand', demandSchema);