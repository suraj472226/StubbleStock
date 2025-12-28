import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmer extends Document {
  user: mongoose.Types.ObjectId;
  totalStubble: number; // in tons
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  currentCluster?: mongoose.Types.ObjectId;
}

const farmerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalStubble: { type: Number, default: 0 },
  currentCluster: { type: Schema.Types.ObjectId, ref: 'Cluster' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  }

});

farmerSchema.index({ location: '2dsphere' });
export default mongoose.model<IFarmer>('Farmer', farmerSchema);