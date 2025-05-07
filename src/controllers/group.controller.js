import { Group } from '../model/group.model.js';
import mongoose from 'mongoose';
import { genrateOtp } from '../utils/genrateOtp.js';

// Create a new group
export const createGroup = async (req, res) => {
  try {
      const { name } = req.body;
      const ownerId = req.user.id;

      let code;
      let codeExists = true;
      while (codeExists) {
          code = genrateOtp();
          const existing = await Group.findOne({ code });
          if (!existing) codeExists = false;
      }

      const group = await Group.create({
          name,
          code,
          owner: mongoose.Types.ObjectId(ownerId),
          members: [{ user: mongoose.Types.ObjectId(ownerId), allowed: true }],
      });

      res.status(201).json({ message: 'Group Created', group });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Join an existing group
export const joinGroup = async (req, res) => {
  try {
      const { code } = req.body;
      const userId = req.user.id;

      const group = await Group.findOne({ code });
      if (!group) return res.status(400).json({ message: 'Group not found' });

      const isMember = group.members.some(member => member.user.toString() === userId);
      if (!isMember) {
          group.members.push({ user: mongoose.Types.ObjectId(userId), allowed: false });
          await group.save();
      }

      res.status(200).json({ message: 'Joined Group Successfully', group });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Set upload permission for a group member
export const setUploadPermission = async (req, res) => {
  try {
      const { groupId, userId, allowed } = req.body;
      const ownerId = req.user.id;
      const isAllowed = allowed === 'true';

      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
      }

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });

      if (group.owner.toString() !== ownerId) {
          return res.status(403).json({ message: 'Only the owner can set permissions' });
      }

      const member = group.members.find(m => m.user.toString() === userId);
      if (!member) return res.status(404).json({ message: 'Member not found' });

      member.allowed = isAllowed;
      await group.save();

      res.status(200).json({ message: 'Permission Updated' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Get all groups joined by a user
export const getUserGroups = async (req, res) => {
  try {
      const userId = req.user.id;
      const groups = await Group.find({ 'members.user': userId }).populate('owner', 'name email');

      if (groups.length === 0) return res.json({ message: 'No groups joined' });
      res.status(200).json({ groups });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Get details of a specific group
export const groupDetail = async (req, res) => {
  try {
      const userId = req.user.id;
      const { groupId } = req.params;

      const group = await Group.findById(groupId).populate('owner', 'name email').populate('members.user', 'name email');

      if (!group) return res.status(404).json({ message: 'Group not found' });
      const isMember = group.members.some(member => member.user._id.toString() === userId);
      if (!isMember) return res.status(403).json({ message: 'Access denied' });

      res.status(200).json({ group });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
