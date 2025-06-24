import { Request, Response } from 'express';
import Tag from '../models/Tag';
import { AuthRequest } from '../middleware/auth';

export const getAllTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find({ aktivna: true })
      .sort({ naziv: 1 });

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju tagova:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju tagova'
    });
  }
};

export const createTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { naziv, opis, boja } = req.body;

    if (!naziv || !boja) {
      res.status(400).json({
        success: false,
        message: 'Naziv i boja su obavezni'
      });
      return;
    }

    const existingTag = await Tag.findOne({ naziv });
    if (existingTag) {
      res.status(400).json({
        success: false,
        message: 'Tag sa ovim nazivom već postoji'
      });
      return;
    }

    const tag = new Tag({
      naziv,
      opis,
      boja,
      aktivna: true
    });

    const savedTag = await tag.save();

    res.status(201).json({
      success: true,
      message: 'Tag uspješno kreiran',
      data: savedTag
    });
  } catch (error: any) {
    console.error('Greška pri kreiranju taga:', error);
    
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
        message: 'Greška pri kreiranju taga'
      });
    }
  }
};

export const updateTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { naziv, opis, boja, aktivna } = req.body;

    const tag = await Tag.findById(id);
    if (!tag) {
      res.status(404).json({
        success: false,
        message: 'Tag nije pronađen'
      });
      return;
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { naziv, opis, boja, aktivna },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Tag uspješno ažuriran',
      data: updatedTag
    });
  } catch (error: any) {
    console.error('Greška pri ažuriranju taga:', error);
    
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
        message: 'Greška pri ažuriranju taga'
      });
    }
  }
};

export const deleteTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
      res.status(404).json({
        success: false,
        message: 'Tag nije pronađen'
      });
      return;
    }

    await Tag.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Tag uspješno obrisan'
    });
  } catch (error) {
    console.error('Greška pri brisanju taga:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju taga'
    });
  }
}; 