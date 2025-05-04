import type { Document } from 'mongoose';

export interface IPerson {
  personId: string;
  name: string;
  currentlyInside?: boolean;
  lastEntry?: Date;
  lastExit?: Date;
}

export interface IPersonDocument extends IPerson, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
