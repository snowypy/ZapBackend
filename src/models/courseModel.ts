import mongoose, { Schema, Document } from 'mongoose';

interface ICourse extends Document {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  isPrivate: boolean;
  invites: mongoose.Types.ObjectId[];
}

const CourseSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  invites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export { Course, ICourse };
