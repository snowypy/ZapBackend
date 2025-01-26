import { Router, Request, Response } from 'express';
import { InviteCode } from '../models/inviteCodeModel';
import { User } from '../models/userModel';

const router = Router();

const generateRandomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

router.post('/create-invite', async (req: Request, res: Response) => {
  const code = generateRandomCode();
  try {
    const newInvite = await InviteCode.create({ code });
    res.status(201).json({ message: 'Invite code created', invite: newInvite });
  } catch (error) {
    res.status(500).json({ message: 'Error creating invite code', error });
  }
});

router.delete('/delete-invite/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedInvite = await InviteCode.findByIdAndDelete(id);
    if (deletedInvite) {
      res.json({ message: 'Invite code deleted', invite: deletedInvite });
    } else {
      res.status(404).json({ message: 'Invite code not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invite code', error });
  }
});

router.get('/invite-info/:code', async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const invite = await InviteCode.findOne({ code });
    if (invite) {
      res.json({ invite });
    } else {
      res.status(404).json({ message: 'Invite code not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving invite code', error });
  }
});

router.post('/delete-user/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      res.json({ message: 'User deleted', user: deletedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
})

export default router;
