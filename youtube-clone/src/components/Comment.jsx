import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { format } from 'timeago.js';
const Container = styled.div`
display:flex;
gap:10px;
margin:30px 0px;
`;

const Avater = styled.img`
width:40px;
height:40px;
border-radius:50%;
`;
const Details=styled.div`
display:flex;
flex-direction:column;
gap:10px;
color:${({theme})=>theme.text};
`;
const Name = styled.span`
font-size:13px;
font-weight:500;
`;
const Date = styled.span`
font-size:12px;
font-weight:400;
color:${({theme})=>theme.textSoft};
margin-left:5px;
`;
const Text = styled.span`
font-size:14px;
`;
export default function Comment({comment}) {
  const [channel,setChannel]=useState({});

  useEffect(()=>{
    const fetchUser =async()=>{
      try{
        const res=await axios.get(`http://localhost:8800/api/users/find/${comment.userId}`);
        setChannel(res.data);
      }catch(err){
        console.log(err);
      }
    }
    fetchUser();
  },[comment.userId]);
  return (
    <Container>
      <Avater src={channel.img}/>
       <Details>
        <Name>{channel.name}<Date>{format(comment.createdAt)}</Date></Name>
        <Text>{comment.desc}</Text>
       </Details>
    </Container>
  )
}
