import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - implementirati' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - implementirati' });
});

router.get('/me', (req, res) => {
  res.json({ message: 'Get current user - implementirati' });
});

export default router; 