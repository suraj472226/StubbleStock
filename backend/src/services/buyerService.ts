import Cluster from '../models/Cluster';
import Order from '../models/Order';
import User from '../models/User';

export const getBuyerDashboardData = async (userId: string) => {
  // 1. Get Buyer Info (to find location)
  const buyer = await User.findById(userId);
  if (!buyer) throw new Error('Buyer not found');

  // 2. Find Available Clusters (READY or FORMING) 
  // Ideally within 100km of the buyer
  const availableClusters = await Cluster.find({ 
    status: { $in: ['FORMING', 'READY'] } 
  });

  const totalTonsAvailable = availableClusters.reduce((acc, curr) => acc + curr.totalQuantity, 0);

  // 3. Count Active and Completed Orders
  const activeOrders = await Order.countDocuments({ buyer: userId, status: 'LOCKED' });
  const completedOrders = await Order.countDocuments({ buyer: userId, status: 'COMPLETED' });

  // 4. Get Recent Activity
  const recentOrders = await Order.find({ buyer: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate({ path: 'cluster', select: 'clusterId' });

  return {
    stats: {
      availableClusters: availableClusters.length,
      totalTonsAvailable,
      activeOrders,
      completedOrders
    },
    recentActivity: recentOrders.map(o => ({
      action: `Locked batch ${(o.cluster as any).clusterId}`,
      time: o.createdAt
    }))
  };
};

export const getAvailableClusters = async () => {
  // Only show clusters that are not already locked or expired
  return await Cluster.find({ 
    status: { $in: ['READY', 'FORMING'] } 
  }).sort({ status: -1 }); // Show READY clusters first
};

export const lockCluster = async (buyerId: string, clusterId: string) => {
  // 1. Find cluster and populate farmers
  const cluster = await Cluster.findById(clusterId).populate('farmers');
  if (!cluster) throw new Error('Cluster not found');
  if (cluster.status === 'LOCKED') throw new Error('This cluster is already secured by another buyer');

  // 2. Create the Order for the ENTIRE tonnage
  const order = await Order.create({
    buyer: buyerId,
    cluster: cluster._id,
    tonnage: cluster.totalQuantity,
    totalAmount: cluster.totalQuantity * 700, // Demo price
    status: 'LOCKED'
  });

  // 3. Mark all Farmers in this cluster as "Fulfillment in Progress"
  // We set currentCluster to null so they don't show up in other searches
  for (const farmer of cluster.farmers as any[]) {
    farmer.currentCluster = null; 
    await farmer.save();
  }

  // 4. Update the Cluster status
  cluster.status = 'LOCKED';
  // Note: We keep the farmers array in the cluster for history/records
  await cluster.save();

  return order;
};

export const getMyOrders = async (buyerId: string) => {
  return await Order.find({ buyer: buyerId })
    .populate({
      path: 'cluster',
      populate: {
        path: 'farmers',
        select: 'location totalStubble user',
        populate: { 
          path: 'user', 
          select: 'name village phone email' // <--- Added phone here
        }
      }
    })
    .sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  // Logic: When an order is COMPLETED, we should also ensure the Cluster is CLOSED
  order.status = status as any;
  await order.save();

  return order;
};