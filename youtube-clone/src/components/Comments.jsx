import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsStart,fetchCommentsSuccess,fetchCommnetsFailure,addComment } from '../redux/commentSlice';
import styled from 'styled-components'
import Comment from './Comment';

const Container = styled.div``;
const NewComment = styled.div`
display:flex;
align-items:center;
gap:10px;
`;
const Avater = styled.img`
width:40px;
height:40px;
border-radius:50%;
`;
const Input = styled.input`
border:none;
border-bottom:1.3px solid ${({theme})=>theme.soft};
background-color:transparent;
outline:none;
padding:5px;
width:100%;
color:${({theme})=>theme.text};
transition: all 0.5s ease;

&:focus{
  border-bottom: 1.3px solid ${({theme})=>theme.text};
}
`;
const Reminder =styled.div`
color:${({theme})=>theme.text};
`;

const Buttons=styled.div`
width:100%;
display:flex;
gap:5px;
justify-content:flex-end;
`;
const Button=styled.button`
padding:10px 20px;
font-weight:500;
border-radius:3px;
border:none;
cursor:pointer;
background-color:${({theme})=>theme.bgLighter};
color:#aaaaaa;
`;

export default function Comments({videoId}) {
  const [input,setInput]=useState("");
  const {currentUser}=useSelector(state=>state.user);
  const {videoComments}=useSelector(state=>state.comment);
  const [commentMode,setCommentMode]=useState(false);
  const dispatch=useDispatch();
  const access_token=document.cookie.split('=')[1]

  useEffect(()=>{
    dispatch(fetchCommentsStart());
    const fetchComments=async ()=>{
      try{
      const res=await axios.get(`http://localhost:8800/api/comments/${videoId}`);
      dispatch(fetchCommentsSuccess(res.data.sort((a,b)=>new Date(b.createdAt)- new Date(a.createdAt))));
      }catch(err){
        console.log(err);
        dispatch(fetchCommnetsFailure());
      }
    }
      fetchComments();
  },[dispatch, videoId])

  const commentSubmit=async()=>{
    try{
      const res = await axios.post('http://localhost:8800/api/comments',{videoId:videoId,desc:input,access_token:access_token});
      dispatch(addComment(res.data));
    }
    catch(err){
      console.log(err);
    }
    setInput("");
  }
  return (
    <Container>
    {currentUser ? 
     <NewComment>
      <Avater src={currentUser.img}/>
        <Input placeholder="add a comment..."
         value={input}
         onChange={e=>setInput(e.target.value)}
         onFocus={()=>setCommentMode(true)}/>
     </NewComment>: <Reminder>Login to comment to this video</Reminder>}
     {commentMode &&
     <Buttons>
      <Button type='cancel' onClick={()=>setCommentMode(false)}>Cancel</Button>
      <Button type='comment'onClick={commentSubmit}>Comment</Button>
     </Buttons>
     }
     {videoComments.map(comment=>(
      <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  )
}
