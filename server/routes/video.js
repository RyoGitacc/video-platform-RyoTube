import express from 'express';
import { addVideo, addView,getByTag, getVideo, random, search, sub, trend,getHistory} from '../controllers/video.js'
import { verifyToken } from '../verifyToken.js';
const router=express.Router();

//create a video
router.post('/', verifyToken,addVideo)
// router.put('/update/:id', verifyToken,updateVideo)  // I will implement them later when having a freetime
// router.delete('/:id', verifyToken,deleteVideo)
router.get('/find/:id',getVideo)
router.put("/view/:id",addView)
router.get("/trend",trend)
router.get("/random",random)
router.get("/sub",verifyToken,sub)
router.get("/history",verifyToken,getHistory);
router.get("/recommend",getByTag)
router.get("/search",search)

export default router;