import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  getTags,
  getMyPosts
} from '../controllers/postsController';

const router = Router();

router.get('/', getAllPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/my', authenticate, getMyPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router; 