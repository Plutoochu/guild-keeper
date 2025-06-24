import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  naslov: string;
  tekst: string;
  autor: Schema.Types.ObjectId;
  tip: 'campaign' | 'adventure' | 'tavern-tale' | 'quest' | 'discussion' | 'announcement';
  kategorije: Schema.Types.ObjectId[];
  tagovi: Schema.Types.ObjectId[];
  level?: {
    min: number;
    max: number;
  };
  igraci?: {
    min: number;
    max: number;
  };
  lokacija?: string;
  status?: 'planning' | 'active' | 'completed' | 'on-hold';
  javno: boolean;
  zakljucaniKomentari: boolean;
  prikvacen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  naslov: {
    type: String,
    required: [true, 'Naslov kampanje je obavezan'],
    trim: true,
    maxlength: [50, 'Naslov ne može biti duži od 50 karaktera']
  },
  tekst: {
    type: String,
    required: [true, 'Opis kampanje je obavezan'],
    trim: true,
    maxlength: [10000, 'Opis ne može biti duži od 10000 karaktera']
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tip: {
    type: String,
    enum: ['campaign', 'adventure', 'tavern-tale', 'quest', 'discussion', 'announcement'],
    default: 'discussion',
    required: true
  },
  kategorije: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tagovi: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  level: {
    min: {
      type: Number,
      min: 1,
      max: 20,
      default: 1,
      required: false
    },
    max: {
      type: Number,
      min: 1,
      max: 20,
      default: 20,
      required: false
    }
  },
  igraci: {
    min: {
      type: Number,
      min: 1,
      max: 10,
      default: 2,
      required: false
    },
    max: {
      type: Number,
      min: 1,
      max: 10,
      default: 6,
      required: false
    }
  },
  lokacija: {
    type: String,
    trim: true,
    maxlength: [100, 'Lokacija ne može biti duža od 100 karaktera'],
    default: '',
    required: false
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on-hold'],
    default: 'planning',
    required: false
  },
  zakljucaniKomentari: {
    type: Boolean,
    default: false,
    required: true
  },
  prikvacen: {
    type: Boolean,
    default: false,
    required: true
  },
  javno: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


PostSchema.pre(/^find/, function(this: any) {
  this.populate({
    path: 'autor',
    select: 'ime prezime email tip'
  }).populate({
    path: 'kategorije',
    select: 'naziv opis boja ikona'
  }).populate({
    path: 'tagovi',
    select: 'naziv opis boja'
  });
});


PostSchema.pre('save', function(this: IPost) {
  if (this.level && this.level.max < this.level.min) {
    this.level.max = this.level.min;
  }
  if (this.igraci && this.igraci.max < this.igraci.min) {
    this.igraci.max = this.igraci.min;
  }
});


PostSchema.index({ naslov: 'text', tekst: 'text' });


PostSchema.index({ kategorije: 1 });
PostSchema.index({ tagovi: 1 });
PostSchema.index({ autor: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ tip: 1 });
PostSchema.index({ status: 1 });


PostSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default model<IPost>('Post', PostSchema); 