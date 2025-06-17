import { Router } from 'express';
import { register, login, me, updateProfile, registerValidation, loginValidation, updateProfileValidation } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, updateProfileValidation, updateProfile);

export default router; 