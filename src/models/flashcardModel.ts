import mongoose, { Document, Schema } from 'mongoose';

interface IFlashcard extends Document {
  question: string;
  answer: string;
}

const FlashcardSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const Flashcard = mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);

export { Flashcard };
