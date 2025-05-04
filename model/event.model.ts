import mongoose, { Schema } from 'mongoose';
import { EventType, type IEventDocument } from '../types/event';

const EventSchema: Schema = new Schema(
  {
    personId: {
      type: String,
      required: true,
      trim: true
    },
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    gate: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IEventDocument>('Event', EventSchema);
