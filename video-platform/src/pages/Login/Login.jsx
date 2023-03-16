import { Link } from 'react-router-dom'
import styles from './login.module.css'
import {loginStart,loginSuccess,loginFailure} from '../../redux/userSlice';
import {auth,provider,facebookProvider} from '../../firebase';
import {signInWithPopup} from 'firebase/auth'
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';


export default function Login() {
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const signInWithGoogle=async()=>{
        loginStart();
        signInWithPopup(auth,provider).then((result)=>{
          console.log(result)
          axios.post('/auth/google',{
            name:result.user.displayName,
            email:result.user.email,
            img:result.user.photoURL,
          }
          ).then(res=>{
            document.cookie=`access_token=${res.data.access_token}`;
            dispatch(loginSuccess(res.data.user))
            navigate("/");
          })
        })
      .catch((err)=>{
        console.log(err);
           dispatch(loginFailure());
        })
      }

      const signInWithFacebook=async()=>{
        loginStart();
        signInWithPopup(auth,facebookProvider).then(async(result)=>{
          const photoUrl=result._tokenResponse.rawUserInfo.match(/https:.+",/)
          try{
           const res= await axios.post('/auth/google',{
                      name:result.user.displayName,
                      email:result.user.providerData[0].email,
                      img:photoUrl[0].slice(0,photoUrl[0].length - 2),
                    })
            document.cookie=`access_token=${res.data.access_token}`;
            dispatch(loginSuccess(res.data.user))
            navigate("/");
          }catch(err){
              console.log(err)
          }
        }).catch(err=>{
            console.log(err)
        })
    }

  
    

  return (
    <div className={styles.login}>
      <ArrowBackIcon className={styles.arrow} onClick={()=>navigate('/')}/>
      <div className={styles["container"]}>
        <img src="./images/login.png" alt=""  className={styles.img}/>
        <p className={styles.text}>Enjoy RyoTube to the fullest</p>
        <p className={styles["sub-text"]}>Login to upload videos, post comment and more!</p>
        <hr className={styles.hr}/>
         <button className={styles.btn} onClick={signInWithGoogle}>
              <img src="./images/google.png" alt=""  className={styles.logo}/>
              <span className={styles["login-text"]}>Login with Google</span>
         </button>
         <button className={styles.btn} onClick={signInWithFacebook}>
              <img src="./images/facebook.png" alt=""  className={styles.logo}/>
              <span className={styles["login-text"]}>Login with Facebook</span>
         </button>
         <Link to={"/login/email"} className={styles.link}>
           <button className={styles.btn}>
              <img src="./images/email.png" alt=""  className={styles.logo}/>
              <span className={styles["login-text"]}>Login with Email</span>
           </button>
         </Link>
         <p className={styles["link-text"]}>
            Don't have an account? 
            <Link to={'/signup'} className={styles["link-to-signup"]}>Create an account</Link>
         </p>
      </div>
    </div>
  )
}
