import { ArrowBackIosNew,
  SearchOutlined, VideoCallOutlined,AccountCircleOutlined, LogoutOutlined, Close} from '@mui/icons-material';
import React, {  useState } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Upload from '../upload/Upload';
import {addSuggest, logout} from '../../redux/userSlice';
import axios from 'axios';
import styles from './navbar.module.css'
import Suggest from '../suggest/Suggest';




export default function Navbar() {
  const {currentUser}= useSelector(state=>state.user)
  const [openSearch,setOpenSearch]=useState(false);
  const [openUpload,setOpenUpload]=useState(false);
  const [openLogout,setOpenLogout]=useState(false)
  const [suggest,setSuggest]=useState([])
  const dispatch=useDispatch()
  const navigate=useNavigate();
  const [searchString,setSearchString]=useState("")
  const access_token= document.cookie.split('=')[1];

  

  const handleClose=()=>{
    setOpenUpload(false)
  }

 
  const closeSearchPage=()=>{
    setOpenSearch(false);
    setSuggest([])
  }
    
  const displaySuggest=(e)=>{
      setSearchString(e.target.value)
      if(currentUser){
        if(e.target.value){
            const regx=new RegExp("^" + e.target.value+ "+",'i')
            const newSuggest=currentUser.suggest.filter(s=>regx.test(s))
            setSuggest(newSuggest)
        }else{
          setSuggest(currentUser.suggest)
        }
      }
  }
  const handleBlur=()=>{
      setTimeout(()=>{
        setSuggest([])
      },120)
   }
  
  const searchByInput=async(e)=>{
    e.preventDefault();
    console.log(e.target.query.value)
    try{
     if(currentUser){
       await axios.put(`/users/add/suggest/${e.target.query.value}`,{},{headers:{access_token}})
       dispatch(addSuggest(e.target.query.value))
     } 
      setSuggest([])
      setOpenSearch(false)
      navigate(`/result?search_query=${e.target.query.value}`)
    }catch(err){
      console.log(err)
    }
  }

  const searchBySuggest=async(s)=>{ 
    setOpenSearch(false)
    setSearchString(s)
    try{
      if(currentUser){
        await axios.put(`/users/add/suggest/${s}`,{},{headers:{access_token}})
        dispatch(addSuggest(s))
      }
      setSuggest([])
      navigate(`/result?search_query=${s}`)
    }catch(err){
      console.log(err)
    }
  }

  const handleLogout=()=>{
    dispatch(logout());
    document.cookie="access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
  }
 

  return (
    <nav className={styles.navbar}>
      <div className={styles["logo-container"]}>
        <img src="/images/video.png"  alt="" className={styles.logo} />
        RyoTube
      </div>
      <form className={styles["search-container"]} onSubmit={e=>searchByInput(e)}>
        <input  autoComplete="off" type="text" className={styles.input} name="query" 
                value={searchString} onChange={e=> displaySuggest(e)} 
                onFocus={()=>currentUser ? setSuggest(currentUser.suggest) : undefined}
                onBlur={handleBlur}/>
        <SearchOutlined style={{color:"white", fontSize:"2rem",padding:"0 10px"}}/>
        {suggest.length !== 0 && 
          <Suggest suggest={suggest} searchBySuggest={searchBySuggest}/>
        }
        <button type="submit" style={{display:"none"}}></button>
      </form>
      <div className={styles["avater-container"]}>
         <SearchOutlined style={{color:"white", fontSize:"2.5rem",padding:"0 10px"}}
                         onClick={()=>setOpenSearch(true)} className={styles["search-icon"]}/>
         <VideoCallOutlined style={{color:"white", fontSize:"2.8rem",padding:"0 10px"}} 
                            onClick={()=>setOpenUpload(true)}/>
        { currentUser ? 
        <span className={styles["avater-wrapper"]}>
          <img src={currentUser.img} alt="" className={styles.avater} onClick={()=>setOpenLogout(!openLogout)}/>
      {openLogout && 
          <div className={styles.logout}>
            <div className={styles["logout-header"]}>
              <Close className={styles["logout-close"]} onClick={()=>setOpenLogout(false)}/>
            </div>
            <div className={styles["logout-body"]} onClick={handleLogout}>
               <LogoutOutlined className={styles["logout-icon"]} />
               Logout
            </div>
          </div>
      }
        </span>:
         <div className={styles["signin-container"]}>
          <button className={styles["signin-btn"]}>
           <Link to="/login" className={styles.link}>
            <AccountCircleOutlined className={styles["signin-icon"]}/> 
             Sign in
           </Link>
          </button>
           <Link to="/login" className={styles["link-mobile"]}>
            <AccountCircleOutlined className={styles["signin-icon"]}/> 
           </Link>
         </div>
        }
      </div>
    {
      openSearch && 
      <div className={styles.modal}>
        <form className={styles.form} onSubmit={searchByInput}>
          <div className={styles["searchbar-mobile"]}>
             <ArrowBackIosNew className={styles.arrow} onClick={closeSearchPage}/>
             <input autoComplete="off" autoFocus type="text"  className={styles["input-mobile"]} 
                                 placeholder="Search by keyword" name="query" 
                                 value={searchString}
                                 onChange={e=> displaySuggest(e)} 
                                 onFocus={()=>currentUser ? setSuggest(currentUser.suggest) : undefined}
                                 />
          </div>
          <Suggest suggest={suggest} searchBySuggest={searchBySuggest}/>
          <button type="submit" style={{display:"none"}}></button>
        </form> 
      </div>
    }
    { openUpload && 
        <Upload handleClose={handleClose} />
    }
    </nav>
    
  )
}
