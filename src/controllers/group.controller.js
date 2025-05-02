import { Group } from "../model/group.model.js";

import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { genrateOtp } from "../utils/genrateOtp.js";

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
        console.log("Userid",userId)
        console.log('After:', group.members);
        res.status(200).json({message:'Joined Group Successfully',group})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

// export const setUploadPermission = async (req, res) => {
//     try {
//         const { groupId, userId, allowed } = req.body;
//         const ownerId = req.user.id;
        
//         // Convert string "true"/"false" to boolean
//         const isAllowed = allowed === "true" || allowed === true;
        
//         // Validate userId is a proper ObjectId
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: 'Invalid user ID' });
//         }

//         const group = await Group.findById(groupId);
//         if (!group) {
//             return res.status(404).json({ message: 'Group Not Found' });
//         }
        
//         if (group?.owner?.toString() !== ownerId) {
//             return res.status(403).json({ message: 'Only owner can set permissions' });
//         }

//         // Convert userId to ObjectId for comparison
//         const userIdObj = new mongoose.Types.ObjectId(userId);
        
//         const existingPermission = group.allowUploads.find(p => 
//             p?.user?.toString() === userId
//         );

//         if (existingPermission) {
//             existingPermission.allowed = isAllowed;
//         } else {
//             group.allowUploads.push({ 
//                 user: userIdObj, 
//                 allowed: isAllowed 
//             });
//         }

//         await group.save();
//         res.status(200).json({ message: 'Permission Updated' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
export const setUploadPermission = async (req, res) => {
    try {
      const { groupId, userId, allowed } = req.body;
      const ownerId = req.user.id;
  
      console.log("ownerId:", ownerId);
      console.log("Input:", groupId, userId, allowed);
  
      const isAllowed = allowed === "true" || allowed === true;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group Not Found' });
      }
  
      console.log("Group found:", group);
  
      if (group.owner.toString() !== ownerId) {
        return res.status(403).json({ message: 'Only owner can set permissions' });
      }
  
      const userIdObj = new mongoose.Types.ObjectId(userId);
  
      // 🧹 Clean any invalid upload permission entries before proceeding
      group.allowUploads = group.allowUploads.filter(p => p.user && mongoose.Types.ObjectId.isValid(p.user));
  
      const existingPermission = group.allowUploads.find(
        (p) => p.user.toString() === userIdObj.toString()
      );
  
      if (existingPermission) {
        existingPermission.allowed = isAllowed;
      } else {
        group.allowUploads.push({
          user: userIdObj,
          allowed: isAllowed
        });
      }
  
      await group.save();
  
      res.status(200).json({ message: 'Permission Updated' });
    } catch (err) {
      console.error("Error in setUploadPermission:", err);
      res.status(500).json({ message: err.message });
    }
  };
  


// export const setUploadPermission = async (req, res) => {
//     try {
//       const { groupId, userId, allowed } = req.body;
//       const ownerId = req.user.id;
//   console.log("ownerid",ownerId)
//   console.log("ownerid",groupId,userId,allowed)

//       // Convert string "true"/"false" to boolean
//       const isAllowed = allowed === "true" || allowed === true;
  
//       // Validate userId is a proper ObjectId
//       if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: 'Invalid user ID' });
//       }
  
//       const group = await Group.findById(groupId);
//       if (!group) {
//         return res.status(404).json({ message: 'Group Not Found' });
//       }
//     console.log("grupid",group)

//       // Ensure only the group owner can modify permissions
//       if (group.owner.toString() !== ownerId) {
//         return res.status(403).json({ message: 'Only owner can set permissions' });
//       }
  
//       // Convert userId to ObjectId for comparison and assignment
//       const userIdObj = new mongoose.Types.ObjectId(userId);
  
//       // Check if the permission already exists
//       const existingPermission = group.allowUploads.find(
//         (p) => p.user && p.user.toString() === userIdObj.toString() // Check if user is defined
//       );
  
//       if (existingPermission) {
//         // Update the existing permission
//         existingPermission.allowed = isAllowed;
//       } else {
//         // Add a new permission for the user
//         group.allowUploads.push({
//           user: userIdObj, // Ensure that user field is correctly assigned as ObjectId
//           allowed: isAllowed
//         });
//       }
  
//       // Save the updated group
//       await group.save();
  
//       res.status(200).json({ message: 'Permission Updated' });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
  
  
export const getUserGroup=async(req,res)=>{
    try{
        console.log("in get grup")
        const userId=req.user.id;
        console.log("userid",userId)
        const group=await Group.find({members:userId}).populate('owner','name email')
        if(!group){
            return res.json({message:'You not Joined in Group'})
        }
        res.status(200).json(group)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

export const groupDetail = async (req, res) => {
    try {
      console.log("in gdetails");
  
      // Ensure userId is a string (assuming req.user.id is already a string)
      const userId = req.user.id;
      console.log("userId", userId);
  
      const { groupId } = req.params;
      console.log("groupId", groupId);
  
      const group = await Group.findById(groupId)
        .populate('owner', 'name email')
        .populate('members', 'name email'); // Populate member details (name, email)
      console.log("group", group);
  
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
          members: group.members, // Directly use populated members
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  