import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/courseModel';

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

router.get('/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('creator students invites');
    if (course) {
      res.json({ course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving course', error });
  }
})

router.post('/join/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { userId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (course && !course.students.includes(userId)) {
      course.students.push(userId);
      await course.save();
      res.json({ message: 'Joined course', course });
    }
    else {
      res.status(404).json({ message: 'Course not found or already joined' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Error joining course', error });
  }
})

export default router;