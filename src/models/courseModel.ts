import { ObjectId } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

interface ICourse extends Document {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[]; 
  invites: mongoose.Types.ObjectId[];
  views: number;
}

const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Types.ObjectId, ref: 'User' }], 
  invites: [{ type: mongoose.Types.ObjectId, ref: 'InviteCode' }],
  views: { type: Number, default: 0 }
});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export { Course, ICourse };
