import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { validationResult } from 'express-validator';
import { 
  registerValidation, 
  updateProfileValidation, 
  loginValidation 
} from '../validators/userValidator';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tip: string;
  };
}

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'default-secret');
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validacijska greška',
        errors: errors.array()
      });
      return;
    }

    const { ime, prezime, email, password, datumRodjenja, spol } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Korisnik sa ovom email adresom već postoji'
      });
      return;
    }

    const user = new User({
      ime,
      prezime,
      email,
      password,
      datumRodjenja,
      spol,
      tip: 'user'
    });

    await user.save();

    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      message: 'Korisnik uspješno registrovan',
      token,
      user: {
        _id: user._id,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        datumRodjenja: user.datumRodjenja,
        spol: user.spol,
        tip: user.tip,
        slika: user.slika,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri registraciji',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validacijska greška',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Neispravni podaci za prijavu'
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Neispravni podaci za prijavu'
      });
      return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      message: 'Uspješna prijava',
      token,
      user: {
        _id: user._id,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        datumRodjenja: user.datumRodjenja,
        spol: user.spol,
        tip: user.tip,
        slika: user.slika,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri prijavi',
      error: error.message
    });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        datumRodjenja: user.datumRodjenja,
        spol: user.spol,
        tip: user.tip,
        slika: user.slika,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju korisnika',
      error: error.message
    });
  }
};



export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validacijska greška',
        errors: errors.array()
      });
      return;
    }

    const { ime, prezime, email, datumRodjenja, spol } = req.body;

    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user?.id } 
      });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Korisnik sa ovom email adresom već postoji'
        });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        ...(ime && { ime }),
        ...(prezime !== undefined && { prezime }),
        ...(email && { email }),
        ...(datumRodjenja && { datumRodjenja }),
        ...(spol !== undefined && { spol })
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profil uspješno ažuriran',
      user: {
        _id: updatedUser._id,
        ime: updatedUser.ime,
        prezime: updatedUser.prezime,
        email: updatedUser.email,
        datumRodjenja: updatedUser.datumRodjenja,
        spol: updatedUser.spol,
        tip: updatedUser.tip,
        slika: updatedUser.slika,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju profila',
      error: error.message
    });
  }
};

 