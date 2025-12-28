import { Router } from 'express';
import { addStubble, approveDate, getDashboard, getMyCluster, proposeDate, sendClusterMessage } from '../controllers/farmerController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();
router.get('/dashboard', protect, authorize('farmer'), getDashboard);
router.post('/add-stubble', protect, authorize('farmer'), addStubble);
router.get('/my-cluster', protect, getMyCluster);

router.post('/cluster/:clusterId/message', protect, authorize('farmer'), sendClusterMessage);
router.post('/cluster/:clusterId/propose-date', protect, authorize('farmer'), proposeDate);
router.post('/cluster/:clusterId/approve-date', protect, authorize('farmer'), approveDate);
export default router;