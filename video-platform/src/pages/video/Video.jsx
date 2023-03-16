import { ThumbUpOutlined ,ThumbDownAltOutlined,VolumeUpOutlined, ThumbUp, ThumbDown} from '@mui/icons-material';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Comments from '../../components/comments/Comments';
import { subscription } from '../../redux/userSlice';
import Navbar from '../../components/navbar/Navbar'
import styles from './video.module.css'
import Recommend from '../../components/recommned/Recommend';
import useFetchVideo from '../../hooks/useFetchVideo';
import useFetchUser from '../../hooks/useFetchUser';
import useFetchRecommend from '../../hooks/useFetchRecommend';
import Moment from 'react-moment';
import Skeleton from '@mui/material/Skeleton';

export default function Video() {

  const [video,setVideo] = useFetchVideo()
  const recommends=useFetchRecommend(video._id,video.tags)
  const user=useFetchUser(video.userId)
  const {currentUser}=useSelector(state=>state.user)
  const access_token= document.cookie.split('=')[1];
  const [isPopup,setIsPopup]=useState(false);
  const dispatch=useDispatch();
  const videoRef=useRef();
  const [unMuted,setUnMuted]=useState(false)
  const [isloading,setIsloading]=useState(true)
  

  const handleLike=async()=>{

    if(!currentUser) {
      setIsPopup(true)
      return;
    }
    if(!video.likes.includes(currentUser._id)){
      setVideo(prev=>({
        ...prev,
        likes:prev.likes.concat([currentUser._id]),
        dislikes:prev.dislikes.filter(d=>d !== currentUser._id)
      }))
    }
    else{
      setVideo(prev=>({
        ...prev,
        likes:prev.likes.filter(d=>d !==currentUser._id)
      }))
    }

    try{
      await axios.put(`/users/like/${video._id}`,{},{headers:{access_token}});
    }catch(err){
      console.log(err)
    }
  }

 const handleDislike=async()=>{

  if(!currentUser) {
    setIsPopup(true)
    return;
  }

  if(!video.dislikes.includes(currentUser._id)){
    setVideo(prev=>({
      ...prev,
      likes:prev.likes.filter(l=>l !== currentUser._id),
      dislikes:prev.dislikes.concat([currentUser._id])
    }))
   }
  else{
    setVideo(prev=>({
      ...prev,
      dislikes:prev.dislikes.filter(d=>d !==currentUser._id)
    }))
   }

   try{
    await axios.put(`/users/dislike/${video._id}`,{},{headers:{access_token}});
  }catch(err){
    console.log(err)
  }
 }

 const handleSub=async()=>{
   dispatch(subscription(user._id))
  try{
    currentUser.subscribedUsers.includes(user._id)?
    await axios.put(`/users/unsub/${user._id}`,{},{headers:{access_token}}) :
    await axios.put(`/users/sub/${user._id}`,{},{headers:{access_token}})
  }catch(err){
    console.log(err)
  }
 }
  
 const closePopup=(e)=>{
  e.stopPropagation();
  setIsPopup(false)
 }

 
 const handleUnmute=()=>{
    setUnMuted(true)
    videoRef.current.muted=false
   
 }

 const handleViewAndHistory=async()=>{
   setIsloading(false)
   try{
      await axios.put(`/videos/view/${video._id}`)
      await axios.put(`/users/add/history/${video._id}`,{},{headers:{access_token}})
  }catch(err){
     console.log(err)
  }
 }

  return (
    <div className={styles["video-page"]}>
      <Navbar/>
      <main className={styles.main}>
        <div className={styles.contents}>
          <div className={styles["video-container"]}>
           <video src={video.video} className={styles.video} controls
                   ref={videoRef} autoPlay={true} muted playsInline onPlay={handleViewAndHistory}/>
           <p className={styles.unmute} onClick={handleUnmute} style={{opacity:unMuted ? 0 : 1}}>
            Click or Tap to unmute
            <VolumeUpOutlined style={{fontSize:"2rem"}}/>
           </p>
          </div>
      {(video.title && user.img && !isloading) ? (
           <div className={styles.details}>
             <p className={styles.title}>{video.title}</p>
             <p className={styles["view-count"]}>
              {video.views} views - {" "}
              <Moment fromNow>{video.createdAt}</Moment>
             </p>
             <p className={styles.desc}>{video.desc}</p>
             <div className={styles["like-dislike-area"]}>
              <div className={styles["like-dislike"]}>
                <button className={styles["like-btn"]} onClick={handleLike}>
                { 
                  video.likes?.includes(currentUser? currentUser._id : "")? 
                  <ThumbUp className={styles.icon} /> :
                  <ThumbUpOutlined className={styles.icon}/>
                }
                </button>
                {video.likes?.length}
                <button className={styles["dislike-btn"]} onClick={handleDislike}>
                {
                  video.dislikes?.includes(currentUser ? currentUser._id : "") ?
                  <ThumbDown className={styles.icon}/> :
                  <ThumbDownAltOutlined className={styles.icon}/>
                }
                </button>
                {video.dislikes?.length}
                {
                  (!currentUser && isPopup) &&
                  <span className={styles.note} onClick={e=>closePopup(e)}>
                     Signin to like or dislike
                    </span>
                }
              </div>
             </div>
             <div className={styles["userInfo-container"]}>
               <div className={styles.userInfo}>
               <img src={user.img} alt="" className={styles.avater} />
               <div className={styles["userInfo-text"]}>
                 <p className={styles.username}>{user.name}</p>
                 <p className={styles["sub-count"]}>{user.subscribers} Subscribers</p>
               </div>
               </div>
              {currentUser && currentUser._id !== video.userId &&
               <div className={styles["sub-btn-container"]}>
                 <button className={styles["sub-btn"]} onClick={handleSub}>
                  {
                    currentUser.subscribedUsers?.includes(user._id) ?
                    "Unsubscribe" : "Subscribe"
                  }
                 </button>
               </div>
              } 
              </div>
           <Comments/>
           </div>)
            :(
              <div className={styles['loading-display']}>
               <Skeleton variant="text" sx={{ fontSize: '1rem' }} className={styles["skelton-text"]} />
               <Skeleton variant="circular" className={styles["skelton-cir"]}/>
               <Skeleton variant="rectangular" className={styles["skelton-rec"]}/>
               <Skeleton variant="rounded" className={styles["skelton-rou"]}/>
              </div>
             )}
        </div>
        <aside className={styles.recommend}>
            <h3 className={styles["recommend-header"]}>Recommend</h3>
          {
            recommends.map((v,index)=>(
              <Recommend video={v} key={index}/>
              )
              )}
        </aside>
        
      </main>
    </div>
  )
}
