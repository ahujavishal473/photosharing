import cloudinary from 'cloudinary'
import { Group } from '../model/group.model.js'
import { Media } from '../model/media.model.js'
export const groupMedia=async( req,res)=>{
    try{
        const userId=req.user.id
        const {groupId}=req.params

        const group=await Group.findById(groupId)
        if (!group || !group.members.includes(userId)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }
        const media=await Media.find({group:groupId}).sort({createdAt:-1})
        res.status(200).json({media})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

export const deleteMedia=async(req,res)=>{
    try{
        const userId=req.user.id
        const {mediaId}=req.params

        const media=await Media.findById(mediaId).populate('group')
        if (!media) return res.status(404).json({ message: 'Media not found' });
        
        const isOwner = media.user.toString() === userId;
        const isGroupOwner = media.group.owner.toString() === userId;
        if (!isOwner && !isGroupOwner) {
            return res.status(403).json({ message: 'Not allowed to delete this media' });
        }
        const publicId=media.url.split('/').pop().split('.')[0]

        await cloudinary.Uploader.destroy(publicId,{
            resource_type: media.type === 'video' ? 'video' : 'image',
        })
        await Media.findByIdAndDelete(mediaId);

        res.status(200).json({ message: 'Media deleted successfully' });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}
