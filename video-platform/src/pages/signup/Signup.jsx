import React, { useState } from 'react'
import styles from './signup.module.css'
// import {PersonOutlineOutlined,EmailOutlined,LockOutlined} from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link, useNavigate} from 'react-router-dom'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import axios from 'axios';

export default function Signup() {
  const [imgUrl,setImgUrl]=useState("");
  const [img,setImg]=useState(null)
  const [imgPerc,setImgPerc]=useState(0)
  const [errMsg,setErrMsg]=useState("")
  const navigate=useNavigate();

  const uploadImg=(file)=>{
    
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage,filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress)
        setImgPerc(Math.round(progress))
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
      setImg(file)
      setImgUrl(downloadURL)
  });
})
};

  const handleSignup=async(e)=>{
    e.preventDefault();

    if(e.target.password.value !== e.target.password2.value){
      setErrMsg("Password must match")
      return;
    }

    if(!imgUrl){
      setErrMsg("Select photo")
      return;
    }
    const user={
          name:e.target.name.value,
          email:e.target.email.value,
          password:e.target.password.value,
          img:imgUrl
    }
        try{
          await axios.post("/auth/signup",user);
          setErrMsg("")
          navigate('/login/email')
        }catch(err){
          console.log(err)
          setErrMsg(err.response.data.message)
        console.log(err);
        }
  }

  return (
    <div className={styles.signup}>
         <ArrowBackIcon className={styles.arrow} onClick={()=>navigate('/login/email')}/>
      <form className={styles.form} onSubmit={handleSignup}>
        <div className={styles["logo-container"]}>
          <img src="/images/video.png"  alt="" className={styles.logo} />
          RyoTube
        </div>
        <p className={styles.title}>Create Account</p>
        <p className={styles["sub-title"]}>Please fill the details and create account</p>
        <input type='text' name="name" placeholder='Username' className={styles.input} required/>
        <input type="email" name="email" placeholder='Email'className={styles.input} required/>
        <input type='password' name="password" placeholder='Password' className={styles.input} required/>
        <input type='password' name="password2" placeholder='Confirm password' className={styles.input} required/>
        <label htmlFor="file" className={styles["photo-btn"]}>
          { (imgPerc > 0 && imgPerc < 99.999) ? imgPerc + "%" : 
            img ? img.name :
            "Select Photo" }
          <input type="file" id="file" className={styles["input-file"]} 
                             onChange={e=>uploadImg(e.target.files[0])} accept=".jpeg,.jpg,.png"/>
        </label>
        {errMsg && <span className={styles.error}>{errMsg}</span>}
        <button type="submit" className={styles.btn}>Create account</button>
        <p className={styles["link-text"]}>have an account? 
           <Link to="/signup"className={styles.link}>Login here</Link>
        </p>
      </form>
    </div>
  )
}
