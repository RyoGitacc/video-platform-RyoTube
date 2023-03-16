import axios from 'axios';
import { useSelector } from 'react-redux';
import Comment from '../comment/Comment';

import styles from './comments.module.css'
import useFetchComments from '../../hooks/useFetchComments';
import { useSearchParams } from 'react-router-dom';



export default function Comments() {
  const {currentUser}=useSelector(state=>state.user);
  const [comments,setComments]=useFetchComments();
  const access_token= document.cookie.split('=')[1];
  const [searchParams]=useSearchParams();
  const videoId=searchParams.get('v');

  

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const newComment={
      videoId,
      comment:e.target.comment.value,
      access_token
    }

    try{
        const res=await axios.post(`/comments/add`,newComment,{headers:{access_token}})
        setComments(prev=>[...prev,res.data])
        e.target.comment.value=""
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className={styles.comments}>
      <p className={styles['comments-count']}>{comments.length} comments</p>
      <form className={styles["comments-header"]} onSubmit={e=>handleSubmit(e)}>
         {currentUser && <img src={currentUser.img} alt=""  className={styles.avater}/>}
         <div className={styles["input-container"]}>
           <input type="text" name="comment" className={styles.input} 
                  autoComplete="off" placeholder={currentUser ? "Enter comment..." : "Sign in to comment"} 
                   disabled={currentUser ? false : true} required/>
           <div className={styles.hr}></div>
         </div>
         <button type='submit' className={styles["submit-btn"]}></button>
      </form>
      <div className={styles["comments-box"]}>
      {comments.sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt)).map((c,index)=>(
        <Comment comment={c} key={index}/>
      ))}
      </div>
    </div>
    
  )
}
