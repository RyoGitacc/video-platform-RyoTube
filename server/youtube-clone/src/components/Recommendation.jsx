import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Card from './Card';
const Container=styled.div`
flex:2;
padding-top:20px;
`;
export default function Recommendation({tags}) {
  const {currentVideo}=useSelector(state=>state.video)
    const [videos,setVideos]=useState([]);
    useEffect(()=>{
     const fetchVideos = async ()=>{
        const res = await axios.get(`https://simple-youtube.herokuapp.com/api/videos/tags?tags=${tags}`);
        const videos = res.data.filter(video=>video._id !== currentVideo._id)
        setVideos(videos)
     }
     fetchVideos();
    },[currentVideo._id, tags])

  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video} type='sm'/>
      ))}
    </Container>
  )
}
