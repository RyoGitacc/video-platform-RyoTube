import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

export default function useFetchVideo() {
  const [video,setVideo]=useState({})
  const [searchParams]=useSearchParams()
  const id =searchParams.get('v');


  useEffect(()=>{
    const fetchVideo=async()=>{
        try{
            const res = await axios.get(`/videos/find/${id}`)
            setVideo(res.data)
        }catch(err){
            console.log(err)
        }
    }
    if(id)
    fetchVideo()

},[id])

  return [video,setVideo]
}
