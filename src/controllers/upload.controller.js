import fs from 'fs';
import path from 'path';
import { cloudinary } from '../utils/cloudinary.js';
import { Media } from '../model/media.model.js';
import { Group } from '../model/group.model.js';
import { User } from '../model/user.model.js';
import { upload } from '../utils/multer.js';


export const uploadFiles = async (req, res) => {
    try {
        const userId = req.user.id;
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        if (group.owner.toString() !== userId && !group.allowUploads.some(p => p.user.toString() === userId && p.allowed)) {
            return res.status(403).json({ message: 'You don’t have permission to upload' });
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        let totalSize = 0;
        for (const file of files) totalSize += file.size;

        const user = await User.findById(userId);
        if (user.storageUsed + totalSize > 1024 * 1024 * 500) {
            return res.status(400).json({ message: 'Max 500MB exceeded' });
        }

        const uploadMedia = [];
        for (const file of files) {
            const filePath = file.path;
            const fileType = file.mimetype.startsWith('video') ? 'video' : 'image';


const result = await cloudinary.uploader.upload(filePath, {
                resource_type: fileType,
                folder: `group-${groupId}`
            });

            const media = await Media.create({
                url: result.secure_url,
                type: fileType,
                user: userId,
                group: groupId
            });

            uploadMedia.push(media);
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("File cleanup failed:", err);
            }
        }

        user.storageUsed += totalSize;
        await user.save();

        res.status(201).json({ message: 'Files Uploaded', files: uploadMedia });
    } catch (err) {
        
        res.status(500).json({ message: err.message });
    }
};
