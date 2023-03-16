import axios from 'axios';
import { useDispatch} from 'react-redux';
import {loginStart,loginSuccess,loginFailure} from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import styles from './loginWithEmail.module.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from 'react-router-dom'
import { useState } from 'react';



export default function LoginWithEmail() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [error,setError]=useState("")

  const handleLogin=async (e)=>{
   e.preventDefault();
   setError("")
   dispatch(loginStart());
   const email=e.target.email.value;
   const password=e.target.password.value;
   try{
      const res=await axios.post("/auth/signin",{email,password});
      console.log(res.data)
      document.cookie=`access_token=${res.data.access_token}`;
      dispatch(loginSuccess(res.data.user));
      navigate("/");
   }catch(err){
    console.log(err.response.data.message)
    setError(err.response.data.message)
      dispatch(loginFailure());
   }
  }



  
  return (
    <div className={styles.signin}>
      <ArrowBackIcon className={styles.arrow} onClick={()=>navigate('/login')}/>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles["logo-container"]}>
          <img src="/images/video.png"  alt="" className={styles.logo} />
          RyoTube
        </div>
        <p className={styles.title}>Login with Email</p>
        <p className={styles["sub-title"]}>Please enter email and password</p>
        <input type="email" name="email" placeholder='Email'className={styles.input} required/>
        <input type='password' name="password" placeholder='Password' className={styles.input} required/>
        {error && <span className={styles.error}>{error}</span>}
        <button type="submit" className={styles.btn}>Login</button>
        <p className={styles["link-text"]}>Don't have an account? 
           <Link to="/signup"className={styles.link}>Create account</Link>
        </p>
      </form>
      {/* <div className={styles.img}></div>
      <div className={styles["form-area"]}>
       <div className={styles["form-wrapper"]}>
        <div className={styles["logo-container"]}>
         <img src="/images/video.png"  alt="" className={styles.logo} />
          RyoTube
        </div>
        <form className={styles.form} onSubmit={e=>handleSubmit(e)}>
          <h3 className={styles["form-header"]}>Sign in</h3>
          <div className={styles['input-container']}>
            <input type="email" name="email" className={styles.input} required/>
            <EmailOutlined className={styles.icon}/>
            <span className={styles.placeholder}>Email</span>
          </div>
          <div className={styles['input-container']}>
            <input type="password" name="password" className={styles.input} required/>
            <LockOutlined className={styles.icon}/>
            <span className={styles.placeholder}>Password</span>
          </div>
          <button type='submit' className={styles['submit-btn']}>Sign in</button>
          <p className={styles["register-link"]}>
            Don't have an account? <Link to='/signup' className={styles.link}>Sign up</Link>
          </p>
          <div className={styles['google-btn']} onClick={signInWithGoogle}>Sign in with Google</div>
        </form>
       </div>
      </div> */}
    </div>
   
  )
}
