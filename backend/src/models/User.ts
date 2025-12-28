// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer';
  phone?: string;
  village?: string;
  companyName?: string;
  plantLocation?: string;
  // Added Location Field
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'buyer'], required: true },
    phone: { type: String },
    village: { type: String },
    companyName: { type: String },
    plantLocation: { type: String },
    // GeoJSON Location
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] } // [longitude, latitude]
    }
  },
  { timestamps: true }
);

// Index for high-speed location searching
userSchema.index({ location: '2dsphere' });

export default mongoose.model<IUser>('User', userSchema);