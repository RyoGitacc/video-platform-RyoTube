import {Home,SubscriptionsOutlined,
    HistoryOutlined,WhatshotOutlined} from '@mui/icons-material';
import { Link} from 'react-router-dom';


import styles from './menu.module.css'



export default function Menu({type}) {
  
 
  return (
   <menu className={styles.menu}>
    <ul className={styles.list}>
     <Link to={'/'} className={styles.link} style={{color:type==="random" ? "#397fdb" : "white"}}>
      <li className={styles["list-item"]}>
         <Home className={styles.icon}/>
         Home
      </li>
     </Link>
     <Link to={'/trend'} className={styles.link} style={{color:type==="trend" ? "#397fdb" : "white"}}>
       <li className={styles["list-item"]}>
         {/* <ExploreOutlined className={styles.icon}/> */}
         <WhatshotOutlined className={styles.icon}/>
         Trend
       </li>
      </Link>
      <Link to={'/subscription'} className={styles.link} style={{color:type==="sub" ? "#397fdb" : "white"}}>
      <li className={styles["list-item"]}>
         <SubscriptionsOutlined className={styles.icon}/>
         Subscription
      </li>
      </Link>
      <Link to={'/history'} className={styles.link} style={{color:type==="history" ? "#397fdb" : "white"}}>
      <li className={styles["list-item"]}>
         <HistoryOutlined className={styles.icon}/>
         History
      </li>
      </Link>
    </ul>
   </menu>
  
  )
}
