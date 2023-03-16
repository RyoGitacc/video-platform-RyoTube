import mongoose from 'mongoose';
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';


export const signup = async(req,res,next)=>{
   try{
     const salt =bcrypt.genSaltSync(10);
     const hash =bcrypt.hashSync(req.body.password,salt)
     const newUser = new User({...req.body,password:hash});

     await newUser.save();
     res.status(200).json(newUser);
   }catch(err){
      console.log(err)
      if(err.code === 11000) next(createError(409,"User already exists"))
      next(createError(404,"something went wrong, try again"));
      // next(err);
   }
}

export const signin = async(req,res,next)=>{
    try{
      const user= await User.findOne({email:req.body.email});
      if(!user) return next(createError(404,"User not found"));
      const isCorrect = bcrypt.compareSync(req.body.password,user.password)
      if(!isCorrect) return next(createError(400,"Wrong credentials"));
      const token = jwt.sign({id:user._id},process.env.JWT);
      const {password,...others}=user._doc;
    
      res.status(200).json({user:others,access_token:token});
    }catch(err){
      //  //next(createError(404,"not found sorry!"));
       next(err);
     
    }
 }

 export const AuthByProvider=async (req,res,next)=>{
   try{
      const user=await User.findOne({email:req.body.email}); 
      if(user){
         const token = jwt.sign({id:user._id},process.env.JWT);
         res.status(200).json({user:user._doc,access_token:token});
      }else{
         const newUser = new User({
            ...req.body,fromGoogle:true
         })
         const savedUser = await newUser.save();
         const token = jwt.sign({id:savedUser._id},process.env.JWT);
         res.status(200).json({user:savedUser,access_token:token});
      }
   }catch(err){
        next(err);
   }
 }