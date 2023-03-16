import User from '../models/User.js';
import Video from '../models/Video.js'
import {createError } from '../error.js';
export const update=async(req,res,next)=>{
  if(req.params.id === req.user.id){
      try{
       const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:req.body
       },{new:true})  // updated user is returned becasue of {new:true}
       res.status(200).json(updatedUser);
      }catch(err){
        next(err);
      }
  }else{
    return next(createError(403,'you can update only your account'))
  }
}

export const deleteUser=async(req,res,next)=>{
  if(req.params.id === req.user.id){
    try{
     await User.findByIdAndDelete(req.params.id)
     res.status(200).json("user has been deleted");
    }catch(err){
      next(err);
    }
}else{
  return next(createError(403,'you can delete only your account'))
}
}

export const getUser=async(req,res,next)=>{
  try{
     const user = await User.findById(req.params.id);
     res.status(200).json(user);
  }catch(err){
    next(err);
  }
}

export const subscribe=async(req,res,next)=>{
    try{
        await User.findByIdAndUpdate(req.user.id,{
          $push:{subscribedUsers:req.params.id}
        });
        await User.findByIdAndUpdate(req.params.id,{
          $inc:{subscribers:1},
        })
        res.status(200).json('Subscription is successful')
    }catch(err){
      next(err);
    }
}

export const unsubscribe=async(req,res,next)=>{
  try{
    await User.findByIdAndUpdate(req.user.id,{
      $pull:{subscribedUsers:req.params.id}
    });
    await User.findByIdAndUpdate(req.params.id,{
      $inc:{subscribers:-1},
    })
    res.status(200).json('Unsubscription is successful')

  }catch(err){
    next(err);
  }
}

export const like=async(req,res,next)=>{
      const id =req.user.id;
      const videoId = req.params.videoId;
      try{
         const video=await Video.findById(videoId);
        if(video.likes.includes(id)){
          await Video.findByIdAndUpdate(videoId,{
            $pull:{likes:id}
          })
        }else{
          await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id}
          })
        }
        res.status(200).json("the video has been liked")
      }catch(err){
         next(err);
       }
}

export const dislike=async(req,res,next)=>{
      const id =req.user.id;
      const videoId = req.params.videoId;
      try{
        const video=await Video.findById(videoId);
        if(video.dislikes.includes(id)){
          await Video.findByIdAndUpdate(videoId,{
            $pull:{dislikes:id}
          })}
          else{
            await Video.findByIdAndUpdate(videoId,{
              $addToSet:{dislikes:id},
              $pull:{likes:id}
            })
          }
        res.status(200).json("the video has been disliked")
      }catch(err){
         next(err);
       }
}

export const addHistory=async(req,res)=>{
  const user = await User.findById(req.user.id);
  
    if(user.history.includes(req.params.videoId)){
       const newHistory=user.history.filter(videoId=>videoId !== req.params.videoId);
       newHistory.unshift(req.params.videoId);
       try{
            await User.updateOne({_id:user._id},{$set:{history:newHistory}})
            res.status(200).json("History added")
          }catch(err){
            next(err)
          }
    }else{
      const newHistory= user.history;
      newHistory.unshift(req.params.videoId)
      if(newHistory.length > 50) newHistory.pop();
      try{
        await User.updateOne({_id:user._id},{$set:{history:newHistory}})
        // await User.findByIdAndUpdate(req.user.id,{
        //         $push:{history:{$each: [req.params.videoId], $position: 0 }}}
        //       );
        res.status(200).json("History added")
      }catch(err){
        next(err)
      }
    }

}

export const addSuggest=async(req,res)=>{
  // console.log(req.params.query)
  const user=await User.findById(req.user.id)
  if(user.suggest.includes(req.params.query)){
    const newSuggest = user.suggest.filter(s=>s !== req.params.query);
    newSuggest.unshift(req.params.query)
    try{
       await User.updateOne({_id:user._id},{$set:{suggest:newSuggest}})
       res.status(200).json("suggest added")
    }catch(err){
       console.log(err)
       next(err)
    }
  }
  else{
    user.suggest.unshift(req.params.query)
    if(user.suggest.length > 10){
      user.suggest.pop();
    }
    try{
      await User.updateOne({_id:user._id},{$set:{suggest:user.suggest}})
      res.status(200).json("suggest added")
   }catch(err){
      console.log(err)
      next(err)
   }

  }
  
}

// export const logout=(req,res,next)=>{
//   res.cookie('access_token','none',{
//     expires: new Date(Date.now() + 1 * 1000),
//     httpOnly: true,
//   });
//   console.log("logout")
//   res.status(200).json('logout');
// }