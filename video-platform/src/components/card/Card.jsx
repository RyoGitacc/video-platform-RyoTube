
import { Link } from 'react-router-dom';
import styles from './card.module.css'
import Moment from 'react-moment';



export default function Card({video}) {



  return (
    <div className={styles.card}>
     <Link to={`/video?v=${video._id}&c=${video.userId}`} className={styles.link}>
      <img src={video.img} alt="" className={styles.thumbnail}/>
      <div className={styles.body}>
         <div className={styles["avater-container"]}>
           <img src={video.userImg} alt="" className={styles.avater}/>
         </div>
         <div className={styles["text-container"]}>
           <p className={styles.title}>{video.title}</p>
           <p className={styles.username}>{video.username}</p>
           <p className={styles["view-count"]}>{video.views} views - {" "}
             <Moment fromNow>{video.createdAt}</Moment> </p>
         </div>
      </div>
     </Link>
    </div>

  )
}
