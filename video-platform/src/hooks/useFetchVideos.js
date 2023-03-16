import axios from 'axios';
import  { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

export default function useFetchVideos(type) {

   const [videos,setVideos]=useState(null);
   const access_token=document.cookie.split('=')[1]
   const [searchParams]=useSearchParams();
   const query=searchParams.get('search_query') || null

   
   

   useEffect(()=>{
    const getVideos=async()=>{
        try{
        const res = type ==="random" ? await axios.get("/videos/random") :
                    type === "trend" ? await axios.get("/videos/trend") :
                    type ==="sub" ? await axios.get("/videos/sub",{headers:{access_token}}):
                    type === "history" ? await axios.get("/videos/history",{headers:{access_token}}):
                    (type === "result" && query) ? await axios.get(`/videos/search?q=${query}`)
                    : {data:[]}
        if(res) setVideos(res.data)
        else setVideos([])
        }catch(err){
          console.log(err)
        }
    }

    getVideos();
   },[access_token, query, type])

  return videos
}
