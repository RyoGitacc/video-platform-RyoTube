import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import {format} from 'timeago.js'
import axios from 'axios';



const Container = styled.div`
width:${(props)=>props.type ==='sm' ? '100%' :'220px'};
margin-bottom:${(props)=>props.type==='sm' ? '10px':'45px'};
cursor:pointer;
display:${(props)=>props.type==='sm' && 'flex'};
gap:10px;
`;

const Image = styled.img`
width: ${(props)=>props.type==='sm' ? '110px' :'100%'};
height:${(props)=>props.type==='sm' ? '90px' :'150px'};
background-color:#999;
flex:1;
`;

const Details = styled.div`
display:flex;
margin-top:${(props)=>props.type!=='sm' && '16px'};
gap:12px;
flex:1;
`;

const ChannelImage=styled.img`
 width:36px;
 height:36px;
 border-radius:50%;
 background-color:#999;
 display:${(props)=>props.type==='sm' && 'none'};
`;

const Texts=styled.div``;
const Title=styled.h1`
font-size:${(props)=>props.type==='sm' ? '13px':'16px'};
font-weight:500;
color: ${({theme})=>theme.text}
`;
const ChannelName=styled.h2`
font-size:${(props)=>props.type==='sm' ? '11px':'14px'};
color:${({theme})=>theme.textSoft};
margin:9px 0px;
`;
const Info=styled.div`
font-size:${(props)=>props.type==='sm' ? '11px':'14px'};;
color:${({theme})=>theme.textSoft}
`;
export default function Card({type,video}) {
   const [channel,setChannel]=useState({});

  useEffect(()=>{
    const fetchChannel=async ()=>{
      const res = await axios.get(`https://simple-youtube.herokuapp.com/api/users/find/${video.userId}`);
      setChannel(res.data);
    }
    fetchChannel();
  },[video.userId]);

  const increaseViewAndAddHistory=async()=>{
    const cookie = {access_token: document.cookie.split('=')[1]}
    try{
      await axios.put(`https://simple-youtube.herokuapp.com/api/videos/view/${video._id}`);
      await axios.put(`https://simple-youtube.herokuapp.com/api/videos/history/${video._id}`,cookie);
    }catch(err){
       console.log(err);
    }
  };

  return (
   <Link to={`/video/${video._id}`} style={{textDecoration:'none'}}> 
    <Container type={type} onClick={increaseViewAndAddHistory}>
      <Image type={type} src={video.imgUrl}/>
      <Details type={type}>
        <ChannelImage type={type} src={channel.img}/>
        <Texts>
            <Title type={type}>{video.title}</Title>
            <ChannelName type={type}>{channel.name}</ChannelName>
            <Info type={type}>{video.views} views - {format(video.createdAt)}</Info>
        </Texts>
      </Details>
    </Container>
    </Link>
  )
}
