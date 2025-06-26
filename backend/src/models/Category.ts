import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  naziv: string;
  opis?: string;
  boja: string;
  ikona?: string;
  aktivna: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema: Schema = new Schema({
  naziv: {
    type: String,
    required: [true, 'Naziv kategorije je obavezan'],
    unique: true,
    trim: true,
    minlength: [2, 'Naziv mora imati najmanje 2 karaktera'],
    maxlength: [50, 'Naziv može imati maksimalno 50 karaktera']
  },
  opis: {
    type: String,
    trim: true,
    maxlength: [200, 'Opis može imati maksimalno 200 karaktera']
  },
  boja: {
    type: String,
    required: [true, 'Boja kategorije je obavezna'],
    match: [/^#[0-9A-F]{6}$/i, 'Boja mora biti u hex formatu (#RRGGBB)']
  },
  ikona: {
    type: String,
    trim: true
  },
  aktivna: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category; 