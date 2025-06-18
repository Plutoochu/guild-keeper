import { Request, Response } from 'express';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';

// Paginacija konfiguracija
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// GET /api/posts - Dohvati sve kampanje sa pagination i filterima
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    // Filter parametri
    const filters: any = {};
    
    // Samo javne objave ako nije admin ili autor
    if (req.query.javno !== 'false') {
      filters.javno = true;
    }

    if (req.query.tip) {
      filters.tip = req.query.tip;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.kategorije) {
      const kategorije = Array.isArray(req.query.kategorije) 
        ? req.query.kategorije 
        : [req.query.kategorije];
      filters.kategorije = { $in: kategorije };
    }

    if (req.query.tagovi) {
      const tagovi = Array.isArray(req.query.tagovi) 
        ? req.query.tagovi 
        : [req.query.tagovi];
      filters.tagovi = { $in: tagovi };
    }

    // Pretraga po nazivu ili opisu
    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }

    // Level range filter
    if (req.query.minLevel || req.query.maxLevel) {
      filters.$and = filters.$and || [];
      if (req.query.minLevel) {
        filters.$and.push({ 'level.max': { $gte: parseInt(req.query.minLevel as string) } });
      }
      if (req.query.maxLevel) {
        filters.$and.push({ 'level.min': { $lte: parseInt(req.query.maxLevel as string) } });
      }
    }

    // Sortiranje
    let sort: any = { createdAt: -1 }; // default najnovije prvo
    if (req.query.sortBy) {
      const sortField = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }

    const posts = await Post.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts: total,
          postsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju kampanja:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju kampanja'
    });
  }
};

// GET /api/posts/:id - Dohvati jednu kampanju
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Kampanja nije pronađena'
      });
      return;
    }

    // Provjeri da li je javna ili korisnik ima pristup
    const authReq = req as AuthRequest;
    const user = authReq.user;
    
    if (!post.javno && (!user || (user.tip !== 'admin' && (post.autor as any)._id.toString() !== user.id))) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za pristup ovoj kampanji'
      });
      return;
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju kampanje:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju kampanje'
    });
  }
};

// POST /api/posts - Kreiraj novu kampanju (samo admin/DM)
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    // Samo admin može kreirati kampanje
    if (user.tip !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Samo Dungeon Master može kreirati kampanje'
      });
      return;
    }

    const {
      naslov,
      tekst,
      tip,
      kategorije,
      tagovi,
      level,
      igraci,
      lokacija,
      status,
      javno
    } = req.body;

    // Validacija obaveznih polja
    if (!naslov || !tekst) {
      res.status(400).json({
        success: false,
        message: 'Naslov i opis kampanje su obavezni'
      });
      return;
    }

    const newPost = new Post({
      naslov,
      tekst,
      autor: user.id,
      tip: tip || 'campaign',
      kategorije: kategorije || [],
      tagovi: tagovi || [],
      level: level || { min: 1, max: 20 },
      igraci: igraci || { min: 2, max: 6 },
      lokacija: lokacija || '',
      status: status || 'planning',
      javno: javno !== undefined ? javno : true
    });

    const savedPost = await newPost.save();
    await savedPost.populate('autor', 'ime prezime email tip');

    res.status(201).json({
      success: true,
      message: 'Kampanja uspješno kreirana',
      data: savedPost
    });

  } catch (error: any) {
    console.error('Greška pri kreiranju kampanje:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Greška validacije',
        errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Greška pri kreiranju kampanje'
      });
    }
  }
};

// PUT /api/posts/:id - Ažuriraj kampanju (samo autor ili admin)
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Kampanja nije pronađena'
      });
      return;
    }

    if (user.tip !== 'admin' && (post.autor as any)._id.toString() !== user.id) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za uređivanje ove kampanje'
      });
      return;
    }

    const updateData = { ...req.body };
    delete updateData.autor; // Sprečiti mijenjanje autora

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Kampanja uspješno ažurirana',
      data: updatedPost
    });

  } catch (error: any) {
    console.error('Greška pri ažuriranju kampanje:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Greška validacije',
        errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Greška pri ažuriranju kampanje'
      });
    }
  }
};

// DELETE /api/posts/:id - Obriši kampanju (samo autor ili admin)
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Kampanja nije pronađena'
      });
      return;
    }

    if (user.tip !== 'admin' && (post.autor as any)._id.toString() !== user.id) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za brisanje ove kampanje'
      });
      return;
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Kampanja uspješno obrisana'
    });

  } catch (error) {
    console.error('Greška pri brisanju kampanje:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju kampanje'
    });
  }
};

// GET /api/posts/categories - Dohvati sve dostupne kategorije
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Post.distinct('kategorije');
    
    res.json({
      success: true,
      data: categories.filter(cat => cat && cat.length > 0)
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju kategorija:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju kategorija'
    });
  }
};

// GET /api/posts/tags - Dohvati sve dostupne tagove
export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Post.distinct('tagovi');
    
    res.json({
      success: true,
      data: tags.filter(tag => tag && tag.length > 0)
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju tagova:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju tagova'
    });
  }
};

// GET /api/posts/my - Dohvati kampanje trenutnog korisnika
export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const posts = await Post.find({ autor: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ autor: user.id });
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts: total,
          postsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju korisničkih kampanja:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju vaših kampanja'
    });
  }
}; 