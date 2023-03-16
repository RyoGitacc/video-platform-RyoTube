
import { Link } from 'react-router-dom';
import styles from './recommend.module.css'
import Moment from 'react-moment'
export default function Recommend({video}) {


  return (
    <div className={styles.recommend}>
      <Link to={`/video?v=${video._id}&c=${video.userId}`} className={styles.link}>
       <img src={video.img ? video.img : ""} alt="" className={styles.thumbnail}/>
       <div className={styles.text}>
        <p className={styles.title}>{video.title}</p>
        <p className={styles.username}>{video.username}</p>
        <p className={styles["view-and-date"]}>{video.views} views - {" "}
        <Moment fromNow>{video.createdAt}</Moment> </p>
       </div>
      </Link>
    </div>
  )
}
