import { Router } from 'express';
import { register, login, reverseGeocode } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/reverse-geocode', reverseGeocode);

export default router;