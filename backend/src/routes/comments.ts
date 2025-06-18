import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentsController';

const router = express.Router();


router.get('/posts/:postId/comments', getCommentsByPost);
router.post('/posts/:postId/comments', authenticate, createComment);


router.put('/comments/:id', authenticate, updateComment);
router.delete('/comments/:id', authenticate, deleteComment);

export default router; 