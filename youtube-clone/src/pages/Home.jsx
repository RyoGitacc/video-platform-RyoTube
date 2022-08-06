import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card';
import axios from 'axios';

const Container=styled.div`
display:flex;
justify-content:space-between;
flex-wrap:wrap;
background-color:${({theme})=>theme.bg};
padding:22px 96px 22px 96px;
`;

export default function Home({type}) {
  const [videos,setVideos]=useState([]);
  

  useEffect(()=>{
    const cookie={
      access_token:document.cookie.split('=')[1]
    }
    
    const fetchVideos=async ()=>{
      
      const res = type!=='sub' 
      ? await axios.get(`http://localhost:8800/api/videos/${type}`)
      : await axios.post(`http://localhost:8800/api/videos/${type}`,cookie)
      
      setVideos(res.data);
    }
    fetchVideos();
  },[type])
  
  return (
    <Container>
    { videos.map(video=>(
         <Card key={video._id} video={video}/>)) 
    }
    </Container>
  )
}

