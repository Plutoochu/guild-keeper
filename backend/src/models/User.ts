import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  ime: string;
  prezime: string;
  email: string;
  password: string;
  datumRodjenja: Date;
  spol: 'muški' | 'ženski' | 'ostalo';
  tip: 'admin' | 'user';
  slika?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  ime: {
    type: String,
    required: [true, 'Ime je obavezno'],
    trim: true,
    maxlength: [50, 'Ime ne može biti duže od 50 karaktera']
  },
  prezime: {
    type: String,
    required: [true, 'Prezime je obavezno'],
    trim: true,
    maxlength: [50, 'Prezime ne može biti duže od 50 karaktera']
  },
  email: {
    type: String,
    required: [true, 'Email je obavezan'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Neispravna email adresa']
  },
  password: {
    type: String,
    required: [true, 'Lozinka je obavezna'],
    minlength: [6, 'Lozinka mora imati najmanje 6 karaktera'],
    select: false
  },
  datumRodjenja: {
    type: Date,
    required: [true, 'Datum rođenja je obavezan']
  },
  spol: {
    type: String,
    required: [true, 'Spol je obavezan'],
    enum: {
      values: ['muški', 'ženski', 'ostalo'],
      message: 'Spol mora biti: muški, ženski ili ostalo'
    }
  },
  tip: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  slika: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

export default model<IUser>('User', UserSchema); 