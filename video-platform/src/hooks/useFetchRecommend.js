import axios from 'axios';
import  { useEffect, useState } from 'react'

export default function useFetchRecommend(id,tags) {
    const [recommend,setRecommend]=useState([]);

    useEffect(()=>{
        const getRecommend=async()=>{
            try{
               const res=await axios.get(`/videos/recommend?tags=${tags.join(',')}&id=${id}`)
               setRecommend(res.data)
            }catch(err){
               console.log(err)
            }
        }
        if(id && tags)
        getRecommend();
    },[id, tags])

  return recommend
}
