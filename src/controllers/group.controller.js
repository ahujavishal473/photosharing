import { Group } from "../model/group.model.js";
import mongoose from "mongoose";


export const createGroup=async (req,res)=>{
    try {
        const {name}=req.body
        const ownerId=req.user.id;
        let code
        let codeExists=true;
        while(codeExists){
            code=genrateOtp()
            const existing=await Group.findOne({code})
            if(!existing) codeExists=false
        }

        const group=await Group.create({name,code,owner:ownerId,members:[ownerId]})

        res.status(201).json({message:'Goup Created',group})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const joinGroup=async(req,res)=>{
    try{
        const {code}=req.body
        const userId=req.user.id

        const group=await Group.findOne({code})
        if(!group){
            return res.status(400).json({message:'Group not Found'})
        }

        if(!group.members.includes(userId)){
            group.members.push(userId);
            await group.save()
            
        }

        res.status(200).json({message:'Joined Group Successfully',group})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}


export const setUploadPermission = async (req, res) => {
    try {
      const { groupId, userId, allowed } = req.body;
      const ownerId = req.user.id;
  
  
      const isAllowed = allowed === 'true'? true:false;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group Not Found' });
      }
  
      if (group.owner.toString() !== ownerId) {
        return res.status(403).json({ message: 'Only owner can set permissions' });
      }
  
      const member = group.members.find(
        (m) => m.user.toString() === userId
      );
  
      // 🧹 Clean any invalid upload permission entries before proceeding
      
      if (!member) {
        return res.status(404).json({ message: "Member not found in group" });
      }
      member.allowed = allowed;
      await group.save();
  
      res.status(200).json({ message: 'Permission Updated' });
    } catch (err) {
      console.error("Error in setUploadPermission:", err);
      res.status(500).json({ message: err.message });
    }
  };
  
  
export const getUserGroup=async(req,res)=>{
    try{

        const userId=req.user.id;

        const group=await Group.find({members:userId}).populate('owner','name email')
        if(!group){
            return res.json({message:'You not Joined in Group'})
        }
        res.status(200).json({group})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

export const groupDetail = async (req, res) => {
    try {

  
      // Ensure userId is a string (assuming req.user.id is already a string)
      const userId = req.user.id;
  
      const { groupId } = req.params;

  
      const group = await Group.findById(groupId)
        .populate('owner', 'name email')
        .populate('members', 'name email'); // Populate member details (name, email)
  
      // Ensure that group.members is an array of strings (converted ObjectId to string)
      if (!group || !group.members.some(member => member._id.toString() === userId)) {
        return res.status(403).json({ message: 'You are not a member of this group' });
      }
  
      // Now group.members contains populated user details
      res.status(200).json({
        group: {
          name: group.name,
          code: group.code,
          owner: group.owner,
          members: group.members,
         
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  