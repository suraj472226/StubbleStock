// backend/src/types/authTypes.ts
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer';
  phone?: string;
  village?: string;
  companyName?: string;
  plantLocation?: string;
  // Added for geolocation
  latitude?: number;
  longitude?: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    village: string;
    companyName: string;
    plantLocation: string;
    location?: [number, number];
  };
}


export interface LoginInput {
  email: string;
  password: string;
  role: 'farmer' | 'buyer';
}
