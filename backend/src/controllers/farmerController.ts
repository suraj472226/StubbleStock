import { Request, Response } from 'express';
import * as farmerService from '../services/farmerService';
import Farmer from '../models/Farmer';
import User from 'models/User';

export const getDashboard = async (req: any, res: Response) => {
  try {
    // req.user comes from authMiddleware
    const data = await farmerService.getFarmerDashboardData(req.user.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addStubble = async (req: any, res: Response) => {
  try {
    const result = await farmerService.addStubbleAndJoinCluster(req.user.id, req.body);
    res.status(201).json({
      message: "Successfully declared stubble and joined cluster",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyCluster = async (req: any, res: Response) => {
  try {
    const cluster = await farmerService.getMyClusterDetails(req.user.id);
    res.json({ success: true, data: cluster });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// 1. Send Message to Cluster
export const sendClusterMessage = async (req: any, res: Response) => {
  try {
    const { clusterId } = req.params;
    const { text } = req.body;
    
    const user = await User.findById(req.user.id);
    const senderName = user?.name || "Farmer";

    const result = await farmerService.addClusterMessage(clusterId, senderName, text);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Propose a new Pickup Window
export const proposeDate = async (req: any, res: Response) => {
  try {
    const { clusterId } = req.params;
    const { newWindow } = req.body; 

    // Split and Validate
    const [start, end] = newWindow.split(' to ');
    if (new Date(start) >= new Date(end)) {
      return res.status(400).json({ success: false, message: "End date must be after start date" });
    }

    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return res.status(404).json({ message: "Farmer profile not found" });

    const result = await farmerService.proposeNewDate(clusterId, farmer._id.toString(), newWindow);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Approve the currently proposed window
export const approveDate = async (req: any, res: Response) => {
  try {
    const { clusterId } = req.params;

    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return res.status(404).json({ message: "Farmer profile not found" });

    const result = await farmerService.approveDate(clusterId, farmer._id.toString());
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};