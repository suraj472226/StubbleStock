import mongoose, { Schema, Document } from 'mongoose';

const orderSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cluster: { type: Schema.Types.ObjectId, ref: 'Cluster', required: true },
  // Simple, realistic statuses
  status: { 
    type: String, 
    enum: ['LOCKED', 'PROCESSING', 'COMPLETED'], 
    default: 'LOCKED' 
  },
  tonnage: Number,
  totalAmount: Number,
  // We track when it was secured
  procuredAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);