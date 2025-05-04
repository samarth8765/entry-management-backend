import mongoose, { Schema } from 'mongoose';
import type { IPersonDocument } from '../types/person';

const PersonSchema: Schema = new Schema(
  {
    personId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    currentlyInside: {
      type: Boolean,
      default: false
    },
    lastEntry: {
      type: Date
    },
    lastExit: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IPersonDocument>('Person', PersonSchema);
