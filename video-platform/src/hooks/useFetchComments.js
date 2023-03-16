import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

export default function useFetchComments() {
    const [comments,setComments]=useState([]);
    const [searchParams]=useSearchParams();
    const videoId=searchParams.get('v');

    useEffect(()=>{
        const getComments=async()=>{
            try{
                const res=await axios.get(`/comments/get/${videoId}`)
                setComments(res.data)
            }catch(err){
                console.log(err)
            }
        }

       if(videoId) getComments();
    },[videoId])

  return [comments,setComments]
}
