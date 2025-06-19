import { Router } from 'express';
import { register, login, me, updateProfile } from '../controllers/authController';
import { registerValidation, loginValidation, updateProfileValidation } from '../validators/userValidator';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, updateProfileValidation, updateProfile);

export default router; 