import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyer extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  industryType: string;
}

const BuyerSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    industryType: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBuyer>('Buyer', BuyerSchema);
