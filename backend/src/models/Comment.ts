import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  _id: string;
  tekst: string;
  autor: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  tekst: {
    type: String,
    required: [true, 'Tekst komentara je obavezan'],
    trim: true,
    maxlength: [1000, 'Komentar ne može biti duži od 1000 karaktera']
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Autor komentara je obavezan']
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post je obavezan']
  }
}, {
  timestamps: true
});


commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ autor: 1 });


commentSchema.pre(/^find/, function(this: any, next) {
  this.populate({
    path: 'autor',
    select: 'ime prezime email tip'
  });
  next();
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment; 