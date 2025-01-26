import { Router, Request, Response } from 'express';
import { Course } from '../models/courseModel';
import * as mongoose from 'mongoose';
import { User } from '../models/userModel';
import express from 'express';
import { Flashcard, IFlashcard } from '../models/flashcardModel';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const { name, description, creatorId, isPrivate } = req.body;
  try {

    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      res.status(400).json({ message: 'Invalid creator ID' });
      return;
    }

    const newCourse = await Course.create({ name, description, creator: creatorId, isPrivate });
    res.status(201).json({ message: 'Course created', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
});

router.post('/join/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { userId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (course && !course.participants.includes(userId)) {
      course.participants.push(userId);
      await course.save();
      res.json({ message: 'Joined course', course });
    } else {
      res.status(404).json({ message: 'Course not found or already joined' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error joining course', error });
  }
});

router.get('/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('creator participants invites');
    if (course) {
      res.json({ course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving course', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate('creator participants invites');
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses', error });
  }
});

router.post('/invite/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { userId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (course && course.isPrivate && !course.invites.includes(userId)) {
      course.invites.push(userId);
      await course.save();
      res.json({ message: 'Invite sent', course });
    } else {
      res.status(404).json({ message: 'Course not found or user already invited' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending invite', error });
  }
});

router.post('/accept-invite/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { userId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (course && course.invites.includes(userId)) {
      course.invites = course.invites.filter(id => id.toString() !== userId);
      if (!course.participants.includes(userId)) {
        course.participants.push(userId);
      }
      await course.save();
      res.json({ message: 'Invite accepted', course });
    } else {
      res.status(404).json({ message: 'Invite not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error accepting invite', error });
  }
});

router.get('/invites/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const courses = await Course.find({ invites: userId }).populate('creator participants invites');
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving invites', error });
  }
});

router.get('/created/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const courses = await Course.find({ creator: userId }).populate('creator participants invites');
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user courses', error });
  }
});

router.post('/:courseId/flashcards/:flashcardId', async (req: Request, res: Response) => {
  try {
    const { flashcardId } = req.params;
    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) {
      res.status(404).json({ error: 'Flashcard not found (${flashcardId})' });
      return;
    }

    res.json(flashcard);
  } catch (error) {
    const { flashcardId } = req.params;
    res.status(500).json({ error: `Failed to get flashcard (${flashcardId})` });
  }
});

router.post('/:courseId/flashcards', async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const { courseId } = req.params;

    const flashcard = new Flashcard({
      question,
      answer,
      courseId,
    });

    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

router.get('/:courseId/flashcards', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const flashcards = await Flashcard.find({ courseId });

    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get all flashcards' });
  }
});

export default router;
