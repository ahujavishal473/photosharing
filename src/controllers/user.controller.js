import { User } from "../model/user.model.js"

export const getStorageUsage=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)
        const usedMB=(user.storageUsed/(1024*1024)).toFixed(2)
        const remainingMB=(500-usedMB).toFixed(2)

        res.status(200).json({
            user:user,
            used: `${usedMB} MB`,
            remaining: `${remainingMB} MB`,
            percent: ((usedMB / 500) * 100).toFixed(2),
          });
      
    }
    catch(err){
        res.status(500).json({ message: err.message });

    }
}