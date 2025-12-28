import express from 'express';
import { create, getAll, getMine } from '../controllers/clusterController';
import { protect } from '../middlewares/authMiddleware';
import { UserRole } from '../constants/roles';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/', protect, authorize(UserRole.FARMER), create);
router.get('/', getAll);
router.get('/my-clusters', protect, authorize(UserRole.FARMER), getMine);

export default router;
