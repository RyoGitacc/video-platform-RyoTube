import React, { useEffect, useRef, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import axios from 'axios';
import { Link} from 'react-router-dom';
import styles from './upload.module.css'
import {FileUpload,Close,ImageOutlined} from '@mui/icons-material';
import { useSelector } from 'react-redux';



export default function Upload({handleClose}) {

  const [video,setVideo]=useState(null);
  const [img,setImg]=useState(null);
  const [videoPerc,setVideoPerc]=useState(0);
  const [imgPerc,setImgPerc]=useState(0);
  const [mediaData,setMediaData]=useState({});
  const [tags,setTags]=useState([])
  const tagRef=useRef();
  const access_token=document.cookie.split('=')[1]
  const {currentUser}=useSelector(state=>state.user)

  useEffect(()=>{
     video && uploadFile(video,"video")
  },[video])

  useEffect(()=>{
     img && uploadFile(img,'img')
  },[img])

  useEffect(()=>{
    tagRef.current.value="";
  },[tags]);

  const uploadFile=(file,mediaType)=>{
          const storage = getStorage(app);
          const filename = new Date().getTime() + file.name;
          const storageRef = ref(storage,filename);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on('state_changed',
          (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              mediaType==='img' ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress))
              switch (snapshot.state) {
                   case 'paused':
                    console.log('Upload is paused');
                    break;
                   case 'running':
                    console.log('Upload is running');
                    break;
                    default:break;
                 }
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMediaData(prev=>{
                return {...prev,[mediaType]:downloadURL}
             })
        });
      })
    };

  const addTag=()=>{
    console.log(tagRef.current?.value)
    if(tagRef.current){
      setTags(prev=>[...prev,tagRef.current.value])
    }
  }

  const deleteTag=(index)=>{
    const newTags=tags.filter((f,fIndex)=> fIndex !== index)
    setTags(newTags)
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!mediaData.img) return;
    console.log(e.target.title.value)
    console.log(mediaData)
    
    const data={
      title:e.target.title.value,
      desc:e.target.desc.value,
      ...mediaData,
      tags,
    }

    try{
      await axios.post("/videos",data,{headers:{access_token}});
      window.location.reload();
    }catch(err){
      console.log(err)
    }
  }
  
  console.log(tags)
  return (
    <div className={styles.upload}>
        <form className={styles.form} onSubmit={e=> (e.keyCode !== 13) ? handleSubmit(e) : undefined}>
          <h3 className={styles.header}>
            Upload video
            <Close className={styles["close-btn"]} onClick={handleClose} />
          </h3>
        <section className={styles.main} >
          <div className={styles["moving-area"]} style={{left:videoPerc >= 100 ? "-100%" : undefined}}>
          { currentUser ?
            <div className={styles['upload-area']}>
              <label htmlFor="file" className={styles["upload-circle"]}>
                <FileUpload className={styles['upload-icon']}/>
                <input type="file" id="file" className={styles["file-input"]} 
                       onChange={e=>setVideo(e.target.files[0])} accept=".mp4, .avi, .mov, .wmv, .flv" />
              </label>
              <p className={styles.direction}>Select a video to upload</p>
              <p className={styles.direction2}>The video is never public until you finished posting</p>
              <p className={styles.percent} style={{visibility: video ? "visible" : "hidden"}}>
                     Upload : {videoPerc}%
              </p>
              <label htmlFor='file' className={styles["upload-btn"]}>Select video</label>
           </div>:
           <div className={styles["need-login"]}>
            Sign in to upload a video
            <Link to={'/login'} className={styles.link}>
            <button className={styles["login-btn"]}>Sign in</button>
            </Link>
            </div>
          }
           <div className={styles["input-area"]}>
              <div className={styles["preview-container"]}>
                <video src={mediaData.video + "#t=0.001"} alt="" className={styles.preview} controls muted playsInline/>
                <p className={styles["filename"]}>Filename : {video?.name}</p>
              </div>
              <div className={styles["inputs-container"]}>
                <div className={styles["textarea-container"]}>
                  <h3 className={styles["textarea-header"]}>Title</h3>
                  <textarea name="title" className={styles["textarea-title"]} required/>
                </div>
                <div className={styles["textarea-container"]}>
                  <h3 className={styles["textarea-header"]}>Descriction</h3>
                  <textarea name="desc" className={styles["textarea-desc"]} required/>
                </div>
                <div className={styles["tag-container"]}>
                  <h3 className={styles["textarea-header"]}>Tags</h3>
                  <p className={styles.desc}>
                    You can add tags to your video<br/>
                    videos are recommended to viewers base on tags
                  </p>
                  <input type="text" className={styles["input-tag"]} ref={tagRef}/>
                  <span className={styles["add-btn"]} onClick={addTag}>Add</span>
                  <p className={styles.tags}>
                    {tags.map((t,index)=>(
                      <span onClick={()=>deleteTag(index)}>#{t} </span>
                      ))}
                  </p>
                </div>
                <div className={styles["thumbnail-container"]}>
                  <h3 className={styles["textarea-header"]}>Thumbnail</h3>
                  <p className={styles.desc}>
                    Upload an image that descrives the contents of the video.<br/>
                    Select an image that draws viewers' attention.
                  </p>
                  <div className={styles["img-container"]}>
                     <label htmlFor="image" className={styles["image-btn"]}>
                      <ImageOutlined className={styles["image-icon"]}/>
                      Select image
                      <input type="file" id="image"className={styles["input-image"]} 
                             onChange={e=>setImg(e.target.files[0])} />
                     </label>
                     { (img && imgPerc < 99.999) ?
                       <div className={styles["img-percent"]}>
                         Upload : {imgPerc}%
                       </div>
                     : mediaData.img ?
                     <img src={mediaData.img} alt="" className={styles["uploaded-img"]}/>:
                     undefined
                     }
                  </div>
                </div>
                <div className={styles["btn-area"]}>
                  <button type="submit" className={styles["submit-btn"]}>
                    Upload
                  </button>
                </div>
              </div>
           </div>
          </div>
        </section>
        </form>
    </div>
   
  )
}
