
import styles from './suggest.module.css'
import {  
  SearchOutlined,
  HistoryOutlined,} from '@mui/icons-material';



export default function Suggest({suggest,searchBySuggest}) {

  return (
      <div className={styles.suggest}>
      {  suggest.map((s,index)=>(
         <p className={styles.text} key={index} onClick={()=>searchBySuggest(s)}>
          <SearchOutlined className={styles.icon}/>
          <HistoryOutlined className={styles["icon-mobile"]}/>
          {s}
         </p>
        ))
      }
      </div>
  )
}
