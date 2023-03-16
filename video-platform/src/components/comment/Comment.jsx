import useFetchUser from '../../hooks/useFetchUser';
import styles from './comment.module.css'
import Moment from 'react-moment'
export default function Comment({comment}) {

const user=useFetchUser(comment.userId)


if(user.img){
  return (
    <div className={styles.comment}>
       <img src={user.img} alt="" className={styles.avater}/>
       <div className={styles.text}>
          <span className={styles.username}>{user.name}</span>
          <span className={styles.date}><Moment fromNow>{comment.createdAt}</Moment></span>
          <p className={styles["comment-text"]}>
           {comment.comment}
          </p>
       </div>
    </div>
  )
}else{
  <div></div>
}
}
