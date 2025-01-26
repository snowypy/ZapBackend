import mongoose, { Document, Schema } from 'mongoose';

interface IFlashcard extends Document {
  question: string;
  answer: string;
  courseId: mongoose.Types.ObjectId;
}

const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

const Flashcard = mongoose.model<IFlashcard>('Flashcard', flashcardSchema);

export { Flashcard, IFlashcard };
