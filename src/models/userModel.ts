import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  inviteCode?: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePictureUrl: { type: String },
  inviteCode: { type: String },
});

export const User = mongoose.model<IUser>('User', UserSchema);
