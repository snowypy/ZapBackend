import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/courseModel';
import { Flashcard } from '../models/flashcardModel';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
    const { courseId, question, answer } = req.body as { courseId: string; question: string; answer: string };
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            res.status(400).json({ message: 'Invalid course ID' });
            return;
        }
        
        const course = await Course.findById(new mongoose.Types.ObjectId(courseId));
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const newFlashcard = await Flashcard.create({ question, answer });
        course.flashcards.push(newFlashcard._id as mongoose.Types.ObjectId);
        await course.save();
        res.status(201).json({ message: 'Flashcard created', flashcard: newFlashcard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating flashcard', error });
    }
});

router.post('/update', async (req: Request, res: Response) => {
    const { flashcardId, question, answer } = req.body as { flashcardId: string; question: string; answer: string };
    try {
        if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
            res.status(400).json({ message: 'Invalid flashcard ID' });
            return;
        }
        const flashcard = await Flashcard.findById(new mongoose.Types.ObjectId(flashcardId));
        if (!flashcard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        flashcard.question = question;
        flashcard.answer = answer;
        await flashcard.save();
        res.status(200).json({ message: 'Flashcard updated', flashcard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating flashcard', error });
    }
});

router.post('/delete', async (req: Request, res: Response) => {
    const { flashcardId } = req.body as { flashcardId: string };
    try {
        if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
            res.status(400).json({ message: 'Invalid flashcard ID' });
            return;
        }
        const flashcard = await Flashcard.findByIdAndDelete(new mongoose.Types.ObjectId(flashcardId));
        if (!flashcard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        res.status(200).json({ message: 'Flashcard deleted', flashcard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting flashcard', error });
    }
});

export default router;