// backend/src/models/Cluster.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICluster extends Document {
  clusterId: string;
  cropType: string;
  status: 'FORMING' | 'READY' | 'LOCKED' | 'EXPIRED';
  farmers: mongoose.Types.ObjectId[];
  totalQuantity: number;
  targetQuantity: number;
  pickupWindow: string;
}

const clusterSchema = new Schema({
  clusterId: { type: String, required: true, unique: true },
  cropType: { type: String, required: true },
  status: { type: String, enum: ['FORMING', 'READY', 'LOCKED', 'EXPIRED'], default: 'FORMING' },
  farmers: [{ type: Schema.Types.ObjectId, ref: 'Farmer' }],

  hubName: { type: String, required: true }, // e.g., "Chandrapur District"
  coveredAreas: [{ type: String }], // e.g., ["Brahmapuri", "Nagbhir", "Sindewahi"]

  totalQuantity: { type: Number, default: 0 },
  targetQuantity: { type: Number, default: 100 },
  
  pickupWindow: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },

  // COORDINATION FIELDS
  proposedWindow: { type: String, default: null },
  approvals: [{ type: Schema.Types.ObjectId, ref: 'Farmer' }], // Who clicked "Yes"
  
  // MESSAGE BOARD
  messages: [{
    senderName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // Center point of cluster
  }
}, { timestamps: true });

clusterSchema.index({ location: '2dsphere' });
export default mongoose.model('Cluster', clusterSchema);