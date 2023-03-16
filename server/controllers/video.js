import { createError } from '../error.js';
import User from '../models/User.js';
import Video from '../models/Video.js'


export const addVideo=async(req,res,next)=>{
    try{
         const user=await User.findById(req.user.id);
         const newVideo = new Video({userId:user._id,
                                     username:user.name,
                                     userImg:user.img,
                                     ...req.body
                                    });
         
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
       }catch(err){
        next(err);
        console.log(err)
       }
}

// function to update a video I will implement them later
// export const updateVideo=async(req,res,next)=>{
//     try{
//     const video = await Video.findById(req.params.id);
//     if(!video) return next(createError(404,'Video not found'));
//     if(req.user.id=== video.userId){
//         const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
//           $set:req.body  
//         },{new:true});
//         res.status(200).json(updatedVideo)
//     }else{
//         return next(createError(403,'You can update only your video'));
//     }
//     }catch(err){
//         next(err);
//     }
// }

// function to delete a video I will implement them later
// export const deleteVideo=async(req,res,next)=>{
//     try{
//         const video = await Video.findById(req.params.id);
//         if(!video) return next(createError(404,'Video not found'));
//         if(req.user.id=== video.userId){
//             await Video.findByIdAndDelete(req.params.id);
//             res.status(200).json("Video has been deleted")
//         }else{
//             return next(createError(403,'You can delete only your video'));
//         }
//         }catch(err){
//             next(err);
//         }
// }

export const getVideo=async(req,res,next)=>{
    try{
      const video = await Video.findById(req.params.id);
      if(!video) return next(createError(404,'Video not found'))
      res.status(200).json(video)
    }catch(err){
        next(err);
    }
}

export const addView=async(req,res,next)=>{
    console.log("view")
    try{
      await Video.findByIdAndUpdate(req.params.id,{
        $inc:{views:1}
      });
      res.status(200).json('The view has been increased')
    }catch(err){
        next(err);
    }
}

export const trend=async(req,res,next)=>{
    try{
      const videos = await Video.find({}).sort({views:-1}); // -1 is most 1 is the least
      res.status(200).json(videos)
    }catch(err){
        next(err);
    }
}

export const random=async(req,res,next)=>{
    try{
     const videos = await Video.aggregate([{$sample:{size:40}}])
      res.status(200).json(videos)
    }catch(err){
        next(err);
    }
}

export const sub=async(req,res,next)=>{
    try{
      const user = await User.findById(req.user.id);
      const subscribedChannels = user.subscribedUsers;
      const list =await Promise.all(
        subscribedChannels.map(channelId=>{
            return Video.find({userId:channelId})
        }
      ))
      res.status(200).json(list.flat().sort((a,b)=>b.createdAt - a.createdAt))
    }catch(err){
        next(err);
    }
}

export const getByTag=async(req,res,next)=>{
    const tags = req.query.tags.split(',');
    const id=req.query.id;
    console.log(tags,id)
    try{
      const videos = await Video.find({$and :[{_id:{$ne:id}},{tags:{$in:tags}}]}).limit(20); // $in:array finds elements which tags property has tags's element
      res.status(200).json(videos)
    }catch(err){
        console.log(err)
        next(err);
    }
}

export const search=async(req,res,next)=>{
    const query = req.query.q;
    
    try{
        const videos = await Video.find({$or:[{title:{$regex:query, $options:'i'}},
                                         {desc:{$regex:query, $options:'i'}}]}).limit(40); // options: i means ignore the capital of the letter
        videos.sort((a,b)=>b.views - a.views)
        res.status(200).json(videos)
    }catch(err){
        console.log(err)
        next(err);
    }
}

export const getHistory=async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id);
        const history = user.history;
        const list =await Promise.all(
          history.map(videoId=>{
              return Video.find({_id:videoId})
          }
        ))
        console.log(list.flat())
        res.status(200).json(list.flat());
      }catch(err){
          next(err);
      }
}

