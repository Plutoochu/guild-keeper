import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';


export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Objava nije pronađena'
      });
      return;
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ post: postId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments: total,
          commentsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju komentara:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju komentara'
    });
  }
};


export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { tekst } = req.body;
    const user = req.user!;

    
    if (!tekst || !tekst.trim()) {
      res.status(400).json({
        success: false,
        message: 'Tekst komentara je obavezan'
      });
      return;
    }

    
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Objava nije pronađena'
      });
      return;
    }

    
    if (post.zakljucaniKomentari) {
      res.status(403).json({
        success: false,
        message: 'Komentari su zaključani na ovoj objavi'
      });
      return;
    }

    
    const newComment = new Comment({
      tekst: tekst.trim(),
      autor: user.id,
      post: postId
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      success: true,
      message: 'Komentar je uspješno kreiran',
      data: savedComment
    });

  } catch (error) {
    console.error('Greška pri kreiranju komentara:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju komentara'
    });
  }
};


export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { tekst } = req.body;
    const user = req.user!;

    
    if (!tekst || !tekst.trim()) {
      res.status(400).json({
        success: false,
        message: 'Tekst komentara je obavezan'
      });
      return;
    }

    
    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Komentar nije pronađen'
      });
      return;
    }

    
    if (user.tip !== 'admin' && (comment.autor as any)._id.toString() !== user.id) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za ažuriranje ovog komentara'
      });
      return;
    }

    
    comment.tekst = tekst.trim();
    const updatedComment = await comment.save();

    res.json({
      success: true,
      message: 'Komentar je uspješno ažuriran',
      data: updatedComment
    });

  } catch (error) {
    console.error('Greška pri ažuriranju komentara:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju komentara'
    });
  }
};


export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    
    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Komentar nije pronađen'
      });
      return;
    }

    
    if (user.tip !== 'admin' && (comment.autor as any)._id.toString() !== user.id) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za brisanje ovog komentara'
      });
      return;
    }

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Komentar je uspješno obrisan'
    });

  } catch (error) {
    console.error('Greška pri brisanju komentara:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju komentara'
    });
  }
}; 