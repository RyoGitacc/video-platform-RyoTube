
import {HistoryOutlined}from '@mui/icons-material';
import Card from '../card/Card';
import styles from './history.module.css'
import { useSelector } from 'react-redux';
import useFetchVideos from '../../hooks/useFetchVideos';
import Recommend from '../recommned/Recommend';

export default function History() {
  const {currentUser}=useSelector(state=>state.user);
  const history=useFetchVideos("history")

 
if(currentUser){
  return (
    <div className={styles.history}>
       <h3 className={styles.header}>
         <HistoryOutlined className={styles.icon}/>
         History
       </h3>
       <div className={styles.main}>
         <div className={styles.cards}>
           {history?.map((h,index)=>(
            <Card video={h} key={index}/>
           ))}
         </div>
         <div className={styles["cards-mobile"]}>
           {history?.map((h,index)=>(
             <Recommend video={h} key={index}/>
           ))}
         </div>
         <div className={styles["user-info"]}>
           <section className={styles["img-container"]}>
             <img src={currentUser.img} alt=""  className={styles.img}/>
           </section>
           <p className={styles.username}>{currentUser.name}</p>
           <div className={styles.info}>
             <p className={styles.item}>
              Subscribers <span className={styles.number}>{currentUser.subscribers}</span>
              </p>
             <p className={styles.item2}>
              Channels you subscribed 
              <span className={styles.number}>{currentUser.subscribedUsers.length}</span>
              </p>
           </div>
         </div>
       </div>
    </div> 
  )
}else{

  return(
  <div className={styles['need-signin']}>
    <div className={styles.center}>
       <HistoryOutlined className={styles["icon-big"]}/>
       <p className={styles.text}>Keep track of what you watched</p>
       <p className={styles["sub-text"]}>History isn't viewable when signed out</p>
    </div>
  </div>
  )

}
}
