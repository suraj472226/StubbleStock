import Demand from '../models/Demand';

export const createNewDemand = async (buyerId: string, data: any) => {
  const { cropType, quantityRequired } = data;
  
  return await Demand.create({
    buyer: buyerId,
    cropType,
    quantityRequired,
    status: 'OPEN'
  });
};

export const getBuyerDemands = async (buyerId: string) => {
  return await Demand.find({ buyer: buyerId }).sort({ createdAt: -1 });
};