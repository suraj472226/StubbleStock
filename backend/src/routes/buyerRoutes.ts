import { Router } from 'express';
import { getDashboard, getAvailableClusters, lockCluster, getOrders, updateOrder } from '../controllers/buyerController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();
router.get('/dashboard', protect, authorize('buyer'), getDashboard);
router.get('/available-clusters', protect, authorize('buyer'), getAvailableClusters);
router.post('/lock-cluster/:clusterId', protect, authorize('buyer'), lockCluster);
router.get('/my-orders', protect, authorize('buyer'), getOrders);
router.patch('/order/:orderId/status', protect, authorize('buyer'), updateOrder);

export default router;