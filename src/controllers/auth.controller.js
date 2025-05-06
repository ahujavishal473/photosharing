import { User } from "../model/user.model.js";
import bcrypt from 'bcrypt';
import { genrateAccessToken,genrateRefreshToken } from "../utils/genrateToken.js";
import jwt from 'jsonwebtoken'

import sendEmail from "../utils/sendEmail.js";
import { genrateOtp } from "../utils/genrateOtp.js";
export const register=async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'Email already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create(
            {name,email,password:hashedPassword}
        )
        res.status(201).json({message:'User created Successfully'})
    }
    catch(err){
        return res.status(500).json({message:err})
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})

        if(!user){
            return res.status(400).json({message:'Invalid Credential'})
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:'Invalid Credential'})
        }

        const otp=genrateOtp()
        user.otp=otp
        user.otpExpire=Date.now()+10*60*1000 
     
        await user.save()

        await sendEmail(user.email,'Your OTP code',`Your otp is ${otp}`)
        res.status(201).json({message:'Otp is send on your device'})

    } 
    catch (err) {
        res.status(500).json({message:err})
    }
}

export const verifyOTP=async(req,res)=>{
    try{
        const {email,otp}=req.body
        const user=await User.findOne({email})
        if(!user || user.otp !== otp || user. otpExpire <Date.now()){
            return res.status(400).json({message:'Invalid or Expired OTP'})
        }
        user.otp=undefined
        user.otpExpire=undefined
        const accessToken=genrateAccessToken(user._id)
        const refreshToken=genrateRefreshToken(user._id)

        user.refreshToken=refreshToken
        await user.save()
// Determine if the request is from localhost
const isLocalhost = req.headers.origin?.includes('localhost');

// Set cookies dynamically
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: !isLocalhost, // false for localhost, true for production
  sameSite: isLocalhost ? 'Lax' : 'None', // Lax for localhost, None for production
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: !isLocalhost, // false for localhost, true for production
  sameSite: isLocalhost ? 'Lax' : 'None',
  maxAge: 24 * 60 * 60 * 1000,
});

        res.status(201).json({message:"OTP verifed and Login Successful "})
    }
    catch(err){
       res.status(500).json({message:err})
    }
}

export const refreshAccessToken=async(req,res)=>{
    try{
        
        const token = req.cookies.refreshToken
        if(!token){
        return res.status(401).json({message:'No Token'})
        }
        const decoded=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

        const user=await User.findById(decoded.id)
        if(!user || user.refreshToken !== token){
            return res.status(401).json({message:'Invalid Token'})
        }
        const accessToken=genrateAccessToken(user._id)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
          });
        res.status(200).json({accessToken})
    }
    catch(err){
        res.status(401).json({message:'Invalid or expired Refresh TOken'})
    }
}

export const logout=async( req,res )=>{
    try{
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken');
        res.status(200).json({message:'Logged Out'})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m',
        });

        // Save token in DB to validate later (optional for one-time use)
        user.resetToken = resetToken;
        await user.save();

        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            'Password Reset Link',
            `Click the following link to reset your password: ${resetURL}\n\nThis link expires in 10 minutes.`
        );

        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (error) {
        console.error('Forgot Password Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
        const user = await User.findById(decoded.id);


        if (!user || user.resetToken !== token) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined; // Clear token after use
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset Password Error:', error.message);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};