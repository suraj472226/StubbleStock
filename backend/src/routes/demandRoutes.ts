import { Router } from 'express';
import { createDemand, getMyDemands, getAllDemands } from '../controllers/demandController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/', protect, authorize('buyer'), createDemand);
router.get('/my', protect, authorize('buyer'), getMyDemands);
router.get('/public', protect, getAllDemands);

export default router;