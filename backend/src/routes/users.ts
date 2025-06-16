import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all users - implementirati' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get user by ID - implementirati' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create user - implementirati' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update user - implementirati' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete user - implementirati' });
});

export default router; 