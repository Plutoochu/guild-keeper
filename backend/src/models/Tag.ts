import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  _id: string;
  naziv: string;
  opis?: string;
  boja: string;
  aktivna: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema: Schema = new Schema({
  naziv: {
    type: String,
    required: [true, 'Naziv taga je obavezan'],
    unique: true,
    trim: true,
    minlength: [2, 'Naziv mora imati najmanje 2 karaktera'],
    maxlength: [30, 'Naziv može imati maksimalno 30 karaktera']
  },
  opis: {
    type: String,
    trim: true,
    maxlength: [150, 'Opis može imati maksimalno 150 karaktera']
  },
  boja: {
    type: String,
    required: [true, 'Boja taga je obavezna'],
    match: [/^#[0-9A-F]{6}$/i, 'Boja mora biti u hex formatu (#RRGGBB)']
  },
  aktivna: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag; 