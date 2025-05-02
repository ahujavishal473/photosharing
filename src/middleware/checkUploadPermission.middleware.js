import { Group } from "../model/group.model.js";

export const checkUploadPermission=async(req,res,next)=>{
    const userId=req.user.id
    const {groupId}=req.params

    const group=await Group.findById(groupId)

    if (group?.owner?.toString() === userId) {
        return next();
    }
    if (!group || !group.members.includes(userId)) {
        return res.status(403).json({ message: 'You are not a member of this group' });
    }
    const permission = group.allowUploads.find(p => p?.user?.toString() === userId);
   
    if (!permission || !permission.allowed) {
        return res.status(403).json({ message: 'You are not allowed to upload in this group' });
    }
    next();
}