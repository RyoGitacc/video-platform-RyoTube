import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';

const Container=styled.div`
display:flex;
justify-content:space-between;
flex-wrap:wrap;
background-color:${({theme})=>theme.bg};
padding:22px 96px 22px 96px;
`;
export default function History() {
//   const {currentUser}=useSelector(state=>state.user);
  const [history,setHistory]=useState([])

  useEffect(()=>{
    const cookie={
        access_token:document.cookie.split('=')[1]
    }
    const getHistory= async()=>{
        try{
        const res=await axios.post(`http://localhost:8800/api/videos/history`,cookie);
        console.log(res.data);
        setHistory(res.data);
        }catch(err){
            console.log(err);
        }
    }
    getHistory();
  },[])
  return (
    <Container>
     {history.map(video=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  )
}
