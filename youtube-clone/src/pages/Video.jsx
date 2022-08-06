import { ThumbUpOutlined ,ThumbDownAltOutlined, ReplyOutlined, AddTaskOutlined, ThumbUp, ThumbDown} from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components'
import { format } from 'timeago.js';
import Comments from '../components/Comments';
import Recommendation from '../components/Recommendation';
import { subscription } from '../redux/userSlice';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
const Container=styled.div`
display:flex;
gap:24px
`;
const Content=styled.div`
flex:5;
padding-top:20px;
padding-left:50px;
`;

const VideoWrapper=styled.div`

`;
const Title=styled.h1`
font-size:18px;
font-weight:400;
margin-top:20px;
margin-bottom:10px;
color:${({theme})=>theme.text}
`;

const Details=styled.div`
display:flex;
align-items:center;
justify-content:space-between;
`;
const Info =styled.span`
color:${({theme})=>theme.textSoft}
`;
const Buttons=styled.div`
display:flex;
gap:20px;
color: ${({theme})=>theme.text};

`;
const Button=styled.button`
display:flex;
align-items:center;
gap:5px;
cursor:pointer;
border:none;
color: ${({theme})=>theme.text};
background-color:transparent;
`;

const Hr=styled.hr`
margin:15px 0px;
border:0.5px solid  ${({theme})=>theme.soft};

`;

const Channel=styled.div`
display:flex;
justify-content:space-between;
`;

const ChannelInfo=styled.div`
display:flex;
gap:20px;
`;
const Image=styled.img`
width:40px;
height:40px;
border-radius:50%;
`;
const ChannelDetail=styled.div`
display:flex;
flex-direction:column;
color:${({theme})=>theme.text};
`;
const ChannelName=styled.span`
font-weight:500;
`;
const ChannelCounter=styled.span`
margin-top:5px;
margin-bottom:20px;
color:${({theme})=>theme.textSoft};
font-size:12px;
`;
const Description=styled.p`
font-size:14px;
`;
const Subscribe = styled.button`
background-color:#cc1a00;
font-weight:500;
color:white;
border:none;
border-radius:3px;
height:max-content;
padding:10px 20px;
cursor:poiter;
`;
const VideoFrame =styled.video`
height:450px;
width:100%;
object-fit:cover`
;

const Reminder =styled.div`
border:0.5px solid;
padding:5px;

`;
export default function Video() {
  const {currentUser}=useSelector(state=>state.user);
  const {currentVideo}=useSelector(state=>state.video)
  const dispatch=useDispatch();
  const path=useLocation().pathname.split("/")[2];
  const [channel,setChannel]=useState({});
  const vidRef=useRef();
  const cookie = {
    access_token:document.cookie.split('=')[1]
  }

  useEffect(()=>{
    const fetchData =async()=>{
      try{
        const videoRes=await axios.get(`http://localhost:8800/api/videos/find/${path}`);
        const channelRes=await axios.get(`http://localhost:8800/api/users/find/${videoRes.data.userId}`);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data))
      }catch(err){
        console.log(err);
      }
    }
    fetchData();
  },[dispatch, path]);

  useEffect(()=>{
    vidRef.current.play();
  },[]);

  const handleLike=async()=>{
    await axios.put(`http://localhost:8800/api/users/like/${currentVideo._id}`,cookie);
    dispatch(like(currentUser._id))
  }

  const handleDislike=async()=>{
    await axios.put(`http://localhost:8800/api/users/dislike/${currentVideo._id}`,cookie)
    dispatch(dislike(currentUser._id))
  }

  const handleSub=async()=>{
    currentUser.subscribedUsers.includes(channel._id)?
    await axios.put(`http://localhost:8800/api/users/unsub/${channel._id}`,cookie) :
    await axios.put(`http://localhost:8800/api/users/sub/${channel._id}`,cookie)
    dispatch(subscription(channel._id))
  }
  return (
    <Container>
      <Content>
        <VideoWrapper>
           <VideoFrame  ref={vidRef} src={currentVideo?.videoUrl}  controls />
          {/* <iframe width="100%" height="500" src="https://www.youtube.com/embed/yIaXoop8gl4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
            <Info>{currentVideo?.views} views - {format(currentVideo?.createdAt)}</Info>
            <Buttons>
                {currentUser ?
                <>
                 <Button onClick={handleLike}>{currentVideo?.likes?.includes(currentUser._id) ? 
                   (<ThumbUp />):(<ThumbUpOutlined/>)
                   }{currentVideo?.likes?.length}
                 </Button>
                 <Button onClick={handleDislike}>
                  {currentVideo?.dislikes?.includes(currentUser._id) ?
                  (<ThumbDown/>):(<ThumbDownAltOutlined/>)}
                   dislike
                 </Button>
                </>
                : <Reminder>Login to like or dislike this video</Reminder>}
                <Button><ReplyOutlined/>Shere</Button>
                <Button><AddTaskOutlined/>Save</Button>
            </Buttons>
             
            
        </Details>
        <Hr/>
        <Channel>
            <ChannelInfo>
                <Image src={channel.img}/>
                <ChannelDetail>
                 <ChannelName>{channel.name}</ChannelName>
                 <ChannelCounter>{channel.Subscribers} subscriber</ChannelCounter>
                <Description>
                    {currentVideo?.desc}
                </Description>
                </ChannelDetail>
            </ChannelInfo>
            <Subscribe onClick={handleSub}>{currentUser?.subscribedUsers.includes(channel._id)? "SUBSCRIBED" : "SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr/>
        <Comments videoId={currentVideo?._id}/>
      </Content>
      <Recommendation tags={currentVideo?.tags}/>
    </Container>
  )
}
