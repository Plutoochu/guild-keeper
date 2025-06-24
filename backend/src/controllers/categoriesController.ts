import { Request, Response } from 'express';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/auth';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ aktivna: true })
      .sort({ naziv: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju kategorija:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju kategorija'
    });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { naziv, opis, boja, ikona } = req.body;

    if (!naziv || !boja || !ikona) {
      res.status(400).json({
        success: false,
        message: 'Naziv, boja i ikona su obavezni'
      });
      return;
    }

    const existingCategory = await Category.findOne({ naziv });
    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Kategorija sa ovim nazivom već postoji'
      });
      return;
    }

    const category = new Category({
      naziv,
      opis,
      boja,
      ikona,
      aktivna: true
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: 'Kategorija uspješno kreirana',
      data: savedCategory
    });
  } catch (error: any) {
    console.error('Greška pri kreiranju kategorije:', error);
    
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
        message: 'Greška pri kreiranju kategorije'
      });
    }
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { naziv, opis, boja, ikona, aktivna } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Kategorija nije pronađena'
      });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { naziv, opis, boja, ikona, aktivna },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Kategorija uspješno ažurirana',
      data: updatedCategory
    });
  } catch (error: any) {
    console.error('Greška pri ažuriranju kategorije:', error);
    
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
        message: 'Greška pri ažuriranju kategorije'
      });
    }
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Kategorija nije pronađena'
      });
      return;
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Kategorija uspješno obrisana'
    });
  } catch (error) {
    console.error('Greška pri brisanju kategorije:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju kategorije'
    });
  }
}; 