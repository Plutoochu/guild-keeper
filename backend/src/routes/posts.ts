import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all posts - implementirati' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get post by ID - implementirati' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create post - implementirati' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update post - implementirati' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete post - implementirati' });
});

export default router; 