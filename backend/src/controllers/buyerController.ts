import { Response } from 'express';
import * as buyerService from '../services/buyerService';
import Cluster from '../models/Cluster';

export const getDashboard = async (req: any, res: Response) => {
  try {
    const data = await buyerService.getBuyerDashboardData(req.user.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableClusters = async (req: any, res: Response) => {
  try {
    const clusters = await Cluster.find({ 
      status: { $in: ['READY', 'FORMING'] } 
    })
    .populate({
      path: 'farmers',
      select: 'location totalStubble user',
      populate: { path: 'user', select: 'name village' }
    })
    .sort({ status: -1 });

    res.json({ success: true, data: clusters });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const lockCluster = async (req: any, res: Response) => {
  try {
    const { clusterId } = req.params;

    // Call service without requestedQuantity
    const order = await buyerService.lockCluster(req.user.id, clusterId);
    
    res.json({ 
      success: true, 
      message: 'Full batch secured successfully', 
      order 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders= async (req: any, res: Response) => {
  try {
    const orders = await buyerService.getMyOrders(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await buyerService.updateOrderStatus(orderId, status);
    res.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};