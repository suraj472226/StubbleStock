import Cluster, { IClusterModel } from '../models/Cluster';
import Farmer from '../models/Farmer';

export const createCluster = async (userId: string, clusterData: Partial<IClusterModel>) => {
  const farmer = await Farmer.findOne({ user: userId });
  if (!farmer) throw new Error('Farmer profile not found');

  const cluster = await Cluster.create({ ...clusterData, farmer: farmer._id });
  return cluster;
};

export const getClusters = async () => {
  return await Cluster.find().populate('farmer');
};

export const getMyClusters = async (userId: string) => {
  const farmer = await Farmer.findOne({ user: userId });
  if (!farmer) throw new Error('Farmer profile not found');
  return await Cluster.find({ farmer: farmer._id });
};
