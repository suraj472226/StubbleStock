// backend/src/services/authService.ts
import User, { IUser } from '../models/User'; // Import IUser interface
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { LoginInput, RegisterInput, LoginResponse } from '../types/authTypes';

// backend/src/services/authService.ts

export const registerUser = async (data: RegisterInput): Promise<LoginResponse> => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) throw new Error('A user with this email already exists');

  const hashedPassword = await hashPassword(data.password);

  // Extract coords from payload
  const { latitude, longitude, ...restOfData } = data;
  
  // Format for MongoDB GeoJSON
  const locationObj = (latitude && longitude) 
    ? { type: 'Point', coordinates: [longitude, latitude] } 
    : undefined;

  const user = (await User.create({
    ...restOfData,
    password: hashedPassword,
    location: locationObj // This saves the [long, lat] to DB
  })) as IUser;

  const token = generateToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      village: user.village || '',
      companyName: user.companyName || '',
      plantLocation: user.plantLocation || '',
    },
  };
};

export const loginUser = async (data: LoginInput): Promise<LoginResponse> => {
  const user = await User.findOne({ email: data.email });
  
  if (!user) throw new Error('Invalid email or password');

  if (user.role !== data.role) {
    throw new Error(`Access denied. Registered as ${user.role}.`);
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = generateToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      village: user.village || '',
      companyName: user.companyName || '',
      plantLocation: user.plantLocation || '',
    },
  };
};