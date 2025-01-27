import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/userModel';
import { InviteCode } from '../models/inviteCodeModel';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const SALT_ROUNDS = 10;

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || uuidv4(), { expiresIn: '7d' });
  res.json({ success: `Welcome back, ${user.username}`, token, userId: `${user._id}` }).status(200);
});

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, inviteCode } = req.body;

  const validInvite = await InviteCode.findOne({ code: inviteCode });
  if (!validInvite) {
    res.status(400).json({ message: 'Invalid invite code' });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'Email in use' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({ username, email, password: hashedPassword, inviteCode });
  res.status(201).json({ success: 'Signed up, redirecting to login page...', user: newUser });
});

router.post('/profile-picture', async (req: Request, res: Response) => {
  const { userId, profilePictureUrl } = req.body;
  const user = await User.findByIdAndUpdate(userId, { profilePictureUrl }, { new: true });
  if (user) {
    res.json({ message: 'Profile updated', user });
  } else {
    res.status(404).json({ message: 'No user found' });
  }
});

router.put('/change-username', async (req: Request, res: Response) => {
  const { userId, username } = req.body;
  
  
  
  const user1 = await User.findById(userId);
  if (user1) {
    if (username === user1.username) {
      res.status(400).json({ message: 'Username cannot be the same as the old username' });
      return;
    }
  
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      res.status(400).json({ message: 'Username in use' });
      return;
    }

    const user = await User.findByIdAndUpdate(userId, { username: username }, { new: true });
    res.json({ success: `Your username has been changed. Hello ${username}!`, user });

  } else {
    res.status(404).json({ message: 'No user found' });
  }
});

router.put('/change-password', async (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body;


  if (oldPassword === newPassword) {
    res.status(400).json({ message: 'New password cannot be the same as the old password' });
    return;
  }

  const user1 = await User.findById(userId);

  if (!user1) {
    res.status(404).json({ message: 'No user found' });
    return;
  }

  if (!await bcrypt.compare(oldPassword, user1.password)) {
    res.status(401).json({ message: 'Invalid old password' });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  if (!user) {
    res.status(404).json({ message: 'No user found' });
    return;
  }

  res.json({ success: 'Your password has been updated. Make sure to store is safely', user });

});

export default router;
