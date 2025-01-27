import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/courseModel';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const { name, description, category, creatorId, isPrivate } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      res.status(400).json({ message: 'Invalid creator ID' });
      return;
    }
    const newCourse = await Course.create({ name, description, category, creator: creatorId, isPrivate });
    res.status(201).json({ message: 'Course created', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
});

router.get('/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate({ path: 'creator', select: 'username' }).populate({ path: 'students', select: 'username' }).populate('invites');
    if (course) {
      Course.updateOne({ _id: courseId }, { $inc: { views: 1 } });
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
    if (course && !course.students.includes(userId) && !course.isPrivate) {
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

router.post('/invite/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { userId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    if (!userId) {
      res.status(400).json({ message: 'User ID not found' });
      return;
    }
    if (!course.isPrivate) {
      res.status(400).json({ message: 'Course is not private' });
      return;
    }
    if (!course.invites.includes(userId)) {
      course.invites.push(userId);
      await course.save();
      res.json({ message: 'Invited to course', course });
    }
    else {
      res.status(404).json({ message: 'Course not found or already invited' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Error inviting course', error });
  }
})

router.post('/accept-invite/:courseId', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { userId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    if (!course.invites.includes(userId)) {
      res.status(404).json({ message: 'Invite revoked or invalid.' });
      return;
    }
    course.invites = course.invites.filter(id => id.toString() !== userId);
    course.students.push(userId);
    await course.save();
    res.json({ message: 'Invite accepted', course });
  }
  catch (error) {
    res.status(500).json({ message: 'Error accepting invite', error });
  }
})

router.get('/:courseId/flashcards', async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('flashcards');
    if (course) {
      res.json({ flashcards: course.flashcards });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving flashcards', error });
  }
})

export default router;