//const express=require('express');
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import * as path from 'path'
// const path = require("path");

const app=express();
dotenv.config();
const connect =()=>{
   mongoose.connect(process.env.MONGO).then(()=>{
    console.log('mongo connected')
   }).catch(err=>{
    throw err;
   });
}

app.use(express.json());
app.use(cookieParser());
// app.use(cors(
//      {
// origin: "http://localhost:3000",
// methods: ['GET', 'PUT', 'POST'],
// allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
// credentials: true,
// exposedHeaders: ['*', 'Authorization' ] 
// }
// ));
app.use(cors({origin: "https://simple-youtube.herokuapp.com",credentials: true,}));
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/comments",commentRoutes);

app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    })
});


app.listen(process.env.PORT || 8800,()=>{
    connect();
    console.log('server running');
})
