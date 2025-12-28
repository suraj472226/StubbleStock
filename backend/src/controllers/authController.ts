import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { getDistrictFromCoords } from '../utils/geocoder';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const reverseGeocode = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Coordinates are required' });
    }

    const areaName = await getDistrictFromCoords(
      parseFloat(longitude as string),
      parseFloat(latitude as string)
    );

    res.json({ success: true, areaName });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};