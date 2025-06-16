import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  naslov: string;
  tekst: string;
  autor: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  naslov: {
    type: String,
    required: [true, 'Naslov je obavezan'],
    trim: true,
    maxlength: [200, 'Naslov ne može biti duži od 200 karaktera']
  },
  tekst: {
    type: String,
    required: [true, 'Tekst je obavezan'],
    trim: true,
    maxlength: [5000, 'Tekst ne može biti duži od 5000 karaktera']
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Populiraj autora prilikom dohvaćanja
PostSchema.pre(/^find/, function(this: any) {
  this.populate({
    path: 'autor',
    select: 'ime prezime email tip'
  });
});

// Ukloni __v field iz output-a
PostSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default model<IPost>('Post', PostSchema); 