// backend/src/services/farmerService.ts
import Farmer from '../models/Farmer';
import Cluster from '../models/Cluster';
import User from '../models/User';
import { getDistrictFromCoords } from '../utils/geocoder';

export const getFarmerDashboardData = async (userId: string) => {
  const farmer = await Farmer.findOne({ user: userId }).populate('currentCluster');
  if (!farmer) return { hasCluster: false, stats: { declaredTons: 0, earnings: 0 } };

  let daysToPickup = "N/A";
  if (farmer.currentCluster) {
    const cluster = farmer.currentCluster as any;
    const start = new Date(cluster.pickupWindow.start);
    const end = new Date(cluster.pickupWindow.end);
    const today = new Date();
    today.setUTCHours(0,0,0,0);

    if (today >= start && today <= end) {
      daysToPickup = "Ongoing";
    } else if (today < start) {
      const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      daysToPickup = diff === 1 ? "Tomorrow" : `${diff} Days`;
    } else {
      daysToPickup = "Expired";
    }
  }

  return {
    hasCluster: !!farmer.currentCluster,
    clusterData: farmer.currentCluster,
    stats: {
      declaredTons: farmer.totalStubble,
      earnings: farmer.totalStubble * 700,
      daysToPickup
    }
  };
};


export const addStubbleAndJoinCluster = async (userId: string, data: any) => {
  const { cropType, landArea, pickupStart, pickupEnd, longitude, latitude } = data;
  const estimatedStubble = parseFloat(landArea) * 2.5;
  const farmerCoords = [longitude, latitude];

  // 1. Normalize dates to UTC Midnight
  const fStart = new Date(pickupStart);
  fStart.setUTCHours(0, 0, 0, 0);
  const fEnd = new Date(pickupEnd);
  fEnd.setUTCHours(0, 0, 0, 0);

  const userProfile = await User.findById(userId);
  const farmerVillage = userProfile?.village || "Unknown Area";

  let farmer = await Farmer.findOne({ user: userId });
  if (farmer?.currentCluster) throw new Error('Already part of an active cluster.');

  if (!farmer) {
    farmer = await Farmer.create({ user: userId, location: { coordinates: farmerCoords } });
  }

  // 2. FIND NEARBY CLUSTER with OVERLAPPING DATES (In one query)
  // Overlap Logic: (FarmerStart <= ClusterEnd) AND (FarmerEnd >= ClusterStart)
  let cluster = await Cluster.findOne({
    cropType,
    status: 'FORMING',
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: farmerCoords },
        $maxDistance: 50000 
      }
    },
    "pickupWindow.start": { $lte: fEnd },
    "pickupWindow.end": { $gte: fStart }
  });

  if (!cluster) {
    const clusterId = `CLU-${Math.floor(1000 + Math.random() * 9000)}`;
    const districtName = await getDistrictFromCoords(longitude, latitude);

    cluster = await Cluster.create({
      clusterId,
      cropType,
      hubName: `${districtName} Regional Hub`,
      coveredAreas: [farmerVillage],
      location: { type: 'Point', coordinates: farmerCoords },
      targetQuantity: 100,
      pickupWindow: { start: fStart, end: fEnd } // Store as Date object
    });
  } else {
    // 3. SHRINK THE WINDOW (Intersection)
    // The new start is the LATEST of the two
    // The new end is the EARLIEST of the two
    if (cluster.pickupWindow) {
      if (fStart > cluster.pickupWindow.start) cluster.pickupWindow.start = fStart;
      if (fEnd < cluster.pickupWindow.end) cluster.pickupWindow.end = fEnd;
    }
    
    if (!cluster.coveredAreas.includes(farmerVillage)) {
      cluster.coveredAreas.push(farmerVillage);
    }
  }

  cluster.farmers.push(farmer._id as any);
  cluster.totalQuantity += estimatedStubble;
  if (cluster.totalQuantity >= cluster.targetQuantity) cluster.status = 'READY';
  
  await cluster.save();
  farmer.totalStubble = estimatedStubble;
  farmer.currentCluster = cluster._id as any;
  await farmer.save();

  return { success: true, cluster };
};


export const getMyClusterDetails = async (userId: string) => {
  // 1. Find farmer and their current cluster
  const farmer = await Farmer.findOne({ user: userId });
  
  if (!farmer || !farmer.currentCluster) {
    throw new Error('You are not currently in any cluster.');
  }

  // 2. Fetch cluster and populate farmer details -> and then user details (for names)
  const cluster = await Cluster.findById(farmer.currentCluster).populate({
    path: 'farmers',
    populate: { path: 'user', select: 'name email village phone' } // Get names of fellow farmers
  });

  return cluster;
};

// 1. Send Message
export const addClusterMessage = async (clusterId: string, senderName: string, text: string) => {
  return await Cluster.findByIdAndUpdate(
    clusterId,
    { $push: { messages: { senderName, text } } },
    { new: true }
  );
};

// 2. Propose New Date
export const proposeNewDate = async (clusterId: string, farmerId: string, newDate: any) => {
  return await Cluster.findByIdAndUpdate(
    clusterId,
    { 
      proposedWindow: newDate, 
      approvals: [farmerId] // Proposer automatically approves
    },
    { new: true }
  );
};

// 3. Approve Date
export const approveDate = async (clusterId: string, farmerId: string) => {
  const cluster = await Cluster.findById(clusterId);
  if (!cluster) throw new Error("Cluster not found");

  if (!cluster.approvals.includes(farmerId as any)) {
    cluster.approvals.push(farmerId as any);
  }

  // LOGIC: If everyone approved, update the main window
  if (cluster.approvals.length === cluster.farmers.length) {
    cluster.pickupWindow = cluster.proposedWindow as any;
    cluster.proposedWindow = null;
    cluster.approvals = [];
    cluster.messages.push({
      senderName: "SYSTEM",
      text: `✅ Consensus reached! New pickup window set to ${cluster.pickupWindow}`
    });
  }

  await cluster.save();
  return cluster;
};

export function getFarmerByUserId(id: any) {
  throw new Error('Function not implemented.');
}
