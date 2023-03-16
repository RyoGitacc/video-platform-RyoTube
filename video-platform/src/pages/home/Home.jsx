
import Card from '../../components/card/Card';
import Navbar from '../../components/navbar/Navbar';
import styles from './home.module.css'
import Menu from '../../components/menu/Menu';
import { useSelector } from 'react-redux';
import useFetchVideos from '../../hooks/useFetchVideos';
import History from '../../components/history/History';
import {SubscriptionsOutlined} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';


export default function Home({type}) {
  const {currentUser}=useSelector(state=>state.user)
  const videos=useFetchVideos(type)

  console.log(videos)

  const SubscriptionOff=()=>{
      return(
        <div className={styles["need-signin"]}>
            <SubscriptionsOutlined className={styles.icon}/>
            <p className={styles.text}>Watch videos from your favorite creaters</p>
            <p className={styles["sub-text"]}>Subscription is not viewable when signed out</p>
        </div>
      )
  }
 
  return (
    <>
    <Navbar/>
    <main className={styles.main}>
     <Menu type={type}/>
     <div className={styles.videos}>
     {
      type === "history"? 
           <History/>:
      (type === "sub" && !currentUser) ? 
           <SubscriptionOff/> :
           <div className={styles["flex-container"]}>
             { videos ? 
                videos.map((v,index)=>(
                 <Card video={v} key={index} />
                )):
                <div className={styles.loading}>
                  <CircularProgress />
                </div>
            }
            </div>
     }
     </div>
    </main>
    </>

  )
}

