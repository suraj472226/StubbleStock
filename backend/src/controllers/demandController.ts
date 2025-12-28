import { Request, Response } from 'express';
import * as demandService from '../services/demandService';
import Demand from 'models/Demand';

export const createDemand = async (req: any, res: Response) => {
  try {
    const demand = await demandService.createNewDemand(req.user.id, req.body);
    res.status(201).json({ success: true, data: demand });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyDemands = async (req: any, res: Response) => {
  try {
    const demands = await demandService.getBuyerDemands(req.user.id);
    res.json({ success: true, data: demands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// backend/src/controllers/demandController.ts

export const getAllDemands = async (req: Request, res: Response) => {
  try {
    // Fetch OPEN demands and populate Buyer's company name only
    const demands = await Demand.find({ status: 'OPEN' })
      .populate('buyer', 'companyName plantLocation')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: demands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};