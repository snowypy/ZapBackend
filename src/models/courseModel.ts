import { ObjectId } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

interface ICourse extends Document {
  name: string;
  description: string;
  category: string;
  creator: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[]; 
  invites: mongoose.Types.ObjectId[];
  flashcards: mongoose.Types.ObjectId[];
  views: number;
  isPrivate: boolean;
}

const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Types.ObjectId, ref: 'User' }], 
  invites: [{ type: mongoose.Types.ObjectId, ref: 'InviteCode' }],
  flashcards: [{ type: mongoose.Types.ObjectId, ref: 'Flashcard' }],
  views: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false }
});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export { Course, ICourse };
