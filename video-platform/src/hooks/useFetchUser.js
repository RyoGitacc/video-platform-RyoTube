import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useFetchUser(id) {
    const [user,setUser]=useState({})

    useEffect(()=>{
        const getChannel=async()=>{
            try{
               const res=await axios.get(`/users/find/${id}`)
               setUser(res.data)
            }catch(err){
               console.log(err)
            }
        }
        if(id)
        getChannel();
    },[id])

  return user;
}
