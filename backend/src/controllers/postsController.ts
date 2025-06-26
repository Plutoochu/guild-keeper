import { Request, Response } from 'express';
import Post from '../models/Post';
import Category from '../models/Category';
import Tag from '../models/Tag';
import { AuthRequest } from '../middleware/auth';


const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;


export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    
    const filters: any = {};
    
    
    if (req.query.javno !== 'false') {
      filters.javno = true;
    }

    
    if (req.query.kategorijaObjave) {
      if (req.query.kategorijaObjave === 'general') {
        
        filters.tip = { $in: ['discussion', 'announcement'] };
      } else if (req.query.kategorijaObjave === 'dnd') {
        
        filters.tip = { $in: ['campaign', 'adventure', 'tavern-tale', 'quest'] };
      }
    }

    
    if (req.query.tip && !req.query.kategorijaObjave) {
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

    
    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }

    
    if (req.query.minLevel || req.query.maxLevel) {
      filters.$and = filters.$and || [];
      if (req.query.minLevel) {
        filters.$and.push({ 'level.max': { $gte: parseInt(req.query.minLevel as string) } });
      }
      if (req.query.maxLevel) {
        filters.$and.push({ 'level.min': { $lte: parseInt(req.query.maxLevel as string) } });
      }
    }

    
    let sort: any = { createdAt: -1 }; 
    if (req.query.sortBy) {
      const sortField = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }

    const posts = await Post.find(filters)
      .populate('autor', 'ime prezime email tip')
      .populate('kategorije', 'naziv boja ikona')
      .populate('tagovi', 'naziv boja')
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
    console.error('Greška pri dohvaćanju objava:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju objava'
    });
  }
};


export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('autor', 'ime prezime email tip')
      .populate('kategorije', 'naziv boja ikona')
      .populate('tagovi', 'naziv boja');

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Objava nije pronađena'
      });
      return;
    }

    
    const authReq = req as AuthRequest;
    const user = authReq.user;
    
    if (!post.javno && (!user || (user.tip !== 'admin' && (post.autor as any)._id.toString() !== user.id))) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za pristup ovoj objavi'
      });
      return;
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju objave:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju objave'
    });
  }
};


export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    
    if (user.tip !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Samo admin može kreirati postove'
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
    javno,
    zakljucaniKomentari,
    prikvacen
  } = req.body;

    
    if (!naslov || !tekst) {
      res.status(400).json({
        success: false,
        message: 'Naslov i sadržaj su obavezni'
      });
      return;
    }

    let kategorijaIds: string[] = [];
    let tagIds: string[] = [];

    if (kategorije && kategorije.length > 0) {
      for (const kategorijaNaziv of kategorije) {
        let kategorija = await Category.findOne({ naziv: kategorijaNaziv.trim() });
        
        if (!kategorija) {
          kategorija = new Category({
            naziv: kategorijaNaziv.trim(),
            boja: '#3B82F6',
            aktivna: true
          });
          await kategorija.save();
        }
        
        kategorijaIds.push(kategorija._id.toString());
      }
    }

    if (tagovi && tagovi.length > 0) {
      for (const tagNaziv of tagovi) {
        let tag = await Tag.findOne({ naziv: tagNaziv.trim() });
        
        if (!tag) {
          tag = new Tag({
            naziv: tagNaziv.trim(),
            boja: '#10B981',
            aktivna: true
          });
          await tag.save();
        }
        
        tagIds.push(tag._id.toString());
      }
    }

    const newPost = new Post({
      naslov,
      tekst,
      autor: user.id,
      tip: tip || 'discussion',
      kategorije: kategorijaIds,
      tagovi: tagIds,
      level: level,
      igraci: igraci,
      lokacija: lokacija,
      status: status,
      javno: javno !== undefined ? javno : true,
      zakljucaniKomentari: zakljucaniKomentari || false,
      prikvacen: prikvacen || false
    });

    const savedPost = await newPost.save();
    await savedPost.populate('autor', 'ime prezime email tip');

    res.status(201).json({
      success: true,
      message: 'Post uspješno kreiran',
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
    delete updateData.autor; 

    let kategorijaIds: string[] = [];
    let tagIds: string[] = [];

    if (updateData.kategorije && updateData.kategorije.length > 0) {
      for (const kategorijaNaziv of updateData.kategorije) {
        let kategorija = await Category.findOne({ naziv: kategorijaNaziv.trim() });
        
        if (!kategorija) {
          kategorija = new Category({
            naziv: kategorijaNaziv.trim(),
            boja: '#3B82F6',
            aktivna: true
          });
          await kategorija.save();
        }
        
        kategorijaIds.push(kategorija._id.toString());
      }
      updateData.kategorije = kategorijaIds;
    }

    if (updateData.tagovi && updateData.tagovi.length > 0) {
      for (const tagNaziv of updateData.tagovi) {
        let tag = await Tag.findOne({ naziv: tagNaziv.trim() });
        
        if (!tag) {
          tag = new Tag({
            naziv: tagNaziv.trim(),
            boja: '#10B981',
            aktivna: true
          });
          await tag.save();
        }
        
        tagIds.push(tag._id.toString());
      }
      updateData.tagovi = tagIds;
    }

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


export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Post.distinct('kategorije');
    
    res.json({
      success: true,
      data: categories.filter(cat => cat != null)
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju kategorija:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju kategorija'
    });
  }
};


export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Post.distinct('tagovi');
    
    res.json({
      success: true,
      data: tags.filter(tag => tag != null)
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju tagova:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju tagova'
    });
  }
};


export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const posts = await Post.find({ autor: user.id })
      .populate('autor', 'ime prezime email tip')
      .populate('kategorije', 'naziv boja ikona')
      .populate('tagovi', 'naziv boja')
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