import { Request, Response } from 'express';
import { AuthRequest } from '../types/requestTypes';
import * as clusterService from '../services/clusterService';
import { sendResponse } from '../utils/responseHandler';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const cluster = await clusterService.createCluster(req.user!.id, req.body);
    sendResponse(res, 201, true, cluster, 'Cluster created successfully');
  } catch (error: any) {
    sendResponse(res, 400, false, null, error.message);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const clusters = await clusterService.getClusters();
    sendResponse(res, 200, true, clusters, 'Clusters retrieved successfully');
  } catch (error: any) {
    sendResponse(res, 500, false, null, error.message);
  }
};

export const getMine = async (req: AuthRequest, res: Response) => {
  try {
    const clusters = await clusterService.getMyClusters(req.user!.id);
    sendResponse(res, 200, true, clusters, 'My clusters retrieved successfully');
  } catch (error: any) {
    sendResponse(res, 500, false, null, error.message);
  }
};
