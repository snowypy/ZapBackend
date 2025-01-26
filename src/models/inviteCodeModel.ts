import mongoose, { Schema, Document } from 'mongoose';

interface IInviteCode extends Document {
  code: string;
  createdAt: Date;
}

const generateRandomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const InviteCodeSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: generateRandomCode
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const InviteCode = mongoose.model<IInviteCode>('InviteCode', InviteCodeSchema);

export { InviteCode, IInviteCode };
