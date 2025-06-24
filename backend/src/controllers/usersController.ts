import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { deleteProfileImage } from '../middleware/upload';
import path from 'path';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;


export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

  
    const filters: any = {};

    if (req.query.tip) {
      filters.tip = req.query.tip;
    }

    if (req.query.aktivan !== undefined) {
      filters.aktivan = req.query.aktivan === 'true';
    }

    if (req.query.spol) {
      filters.spol = req.query.spol;
    }

    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filters.$or = [
        { ime: searchRegex },
        { prezime: searchRegex },
        { email: searchRegex }
      ];
    }

    
    let sort: any = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }

    const users = await User.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    
    const stats = {
      ukupno: await User.countDocuments(),
      aktivni: await User.countDocuments({ aktivan: true }),
      admini: await User.countDocuments({ tip: 'admin' }),
      obicniKorisnici: await User.countDocuments({ tip: 'user' })
    };

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          usersPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju korisnika:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju korisnika'
    });
  }
};


export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Greška pri dohvaćanju korisnika:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju korisnika'
    });
  }
};


export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      ime,
      prezime,
      email,
      password,
      datumRodjenja,
      spol,
      tip
    } = req.body;

   
    if (!ime || !email || !password || !datumRodjenja) {
      res.status(400).json({
        success: false,
        message: 'Ime, email, lozinka i datum rođenja su obavezni'
      });
      return;
    }

    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Korisnik sa ovim email-om već postoji'
      });
      return;
    }

    const newUser = new User({
      ime,
      prezime: prezime || undefined,
      email: email.toLowerCase(),
      password,
      datumRodjenja,
      spol: spol || undefined,
      tip: tip || 'user',
      aktivan: true
    });

    const savedUser = await newUser.save();
    
    
    const userResponse = savedUser.toJSON() as any;
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Korisnik uspješno kreiran',
      data: userResponse
    });

  } catch (error: any) {
    console.error('Greška pri kreiranju korisnika:', error);
    
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
        message: 'Greška pri kreiranju korisnika'
      });
    }
  }
};


export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    const currentUser = req.user!;
    
    
    if (currentUser.tip !== 'admin' && (user._id as any).toString() !== currentUser.id) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za ažuriranje ovog korisnika'
      });
      return;
    }

    const updateData = { ...req.body };
    
    
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    
    if (currentUser.tip !== 'admin') {
      delete updateData.tip;
      delete updateData.aktivan;
    }

    
    if (updateData.email && updateData.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email.toLowerCase(),
        _id: { $ne: user._id }
      });
      
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Korisnik sa ovim email-om već postoji'
        });
        return;
      }
      
      updateData.email = updateData.email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Korisnik uspješno ažuriran',
      data: updatedUser
    });

  } catch (error: any) {
    console.error('Greška pri ažuriranju korisnika:', error);
    
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
        message: 'Greška pri ažuriranju korisnika'
      });
    }
  }
};


export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    const currentUser = req.user!;

    
    if ((user._id as any).toString() === currentUser.id) {
      res.status(400).json({
        success: false,
        message: 'Ne možete obrisati svoj račun'
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Korisnik uspješno obrisan'
    });

  } catch (error) {
    console.error('Greška pri brisanju korisnika:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju korisnika'
    });
  }
};


export const toggleUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    const currentUser = req.user!;

    
    if ((user._id as any).toString() === currentUser.id) {
      res.status(400).json({
        success: false,
        message: 'Ne možete mijenjati vlastitu ulogu'
      });
      return;
    }

    
    const newRole = user.tip === 'admin' ? 'user' : 'admin';
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { tip: newRole },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: `Uloga korisnika promijenjena u ${newRole}`,
      data: updatedUser
    });

  } catch (error) {
    console.error('Greška pri mijenjanju uloge:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri mijenjanju uloge korisnika'
    });
  }
};


export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    const currentUser = req.user!;

    
    if ((user._id as any).toString() === currentUser.id) {
      res.status(400).json({
        success: false,
        message: 'Ne možete deaktivirati vlastiti račun'
      });
      return;
    }

    
    const newStatus = !user.aktivan;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { aktivan: newStatus },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: `Korisnik ${newStatus ? 'aktiviran' : 'deaktiviran'}`,
      data: updatedUser
    });

  } catch (error) {
    console.error('Greška pri mijenjanju statusa:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri mijenjanju statusa korisnika'
    });
  }
};


export const bulkUserActions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userIds, action } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Lista korisnika je obavezna'
      });
      return;
    }

    if (!action || !['activate', 'deactivate', 'delete', 'makeAdmin', 'makeUser'].includes(action)) {
      res.status(400).json({
        success: false,
        message: 'Neispravna akcija'
      });
      return;
    }

    const currentUserId = req.user!.id;
    
    
    const filteredUserIds = userIds.filter(id => id !== currentUserId);

    if (filteredUserIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Ne možete izvršiti akciju na vlastitom računu'
      });
      return;
    }

    let updateData: any = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateData = { aktivan: true };
        message = 'Korisnici aktivirani';
        break;
      case 'deactivate':
        updateData = { aktivan: false };
        message = 'Korisnici deaktivirani';
        break;
      case 'makeAdmin':
        updateData = { tip: 'admin' };
        message = 'Korisnici promijenjeni u administratore';
        break;
      case 'makeUser':
        updateData = { tip: 'user' };
        message = 'Korisnici promijenjeni u obične korisnike';
        break;
      case 'delete':
        await User.deleteMany({ _id: { $in: filteredUserIds } });
        res.json({
          success: true,
          message: `${filteredUserIds.length} korisnika obrisano`,
          data: { affectedUsers: filteredUserIds.length }
        });
        return;
    }

    const result = await User.updateMany(
      { _id: { $in: filteredUserIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${message} (${result.modifiedCount} korisnika)`,
      data: { affectedUsers: result.modifiedCount }
    });

  } catch (error) {
    console.error('Greška pri bulk operaciji:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri izvršavanju bulk operacije'
    });
  }
};

export const uploadUserProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id || req.user?.id;
    const currentUser = req.user!;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'ID korisnika je obavezan'
      });
      return;
    }

    if (userId !== currentUser.id && currentUser.tip !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za mijenjanje slike ovog korisnika'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Slika je obavezna'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    if (user.slika) {
      deleteProfileImage(path.basename(user.slika));
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { slika: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Slika profila uspješno ažurirana',
      data: updatedUser
    });

  } catch (error) {
    console.error('Greška pri upload slike:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri upload slike'
    });
  }
};

export const deleteUserProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id || req.user?.id;
    const currentUser = req.user!;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'ID korisnika je obavezan'
      });
      return;
    }

    if (userId !== currentUser.id && currentUser.tip !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za brisanje slike ovog korisnika'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    if (user.slika) {
      deleteProfileImage(path.basename(user.slika));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { slika: null },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Slika profila uspješno obrisana',
      data: updatedUser
    });

  } catch (error) {
    console.error('Greška pri brisanju slike:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju slike'
    });
  }
};

export const deleteOwnAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUser = req.user!;
    const user = await User.findById(currentUser.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    if (user.slika) {
      deleteProfileImage(path.basename(user.slika));
    }

    await Post.deleteMany({ autor: currentUser.id });
    await Comment.deleteMany({ autor: currentUser.id });
    await User.findByIdAndDelete(currentUser.id);

    res.json({
      success: true,
      message: 'Account je uspješno obrisan'
    });

  } catch (error) {
    console.error('Greška pri brisanju account-a:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju account-a'
    });
  }
}; 