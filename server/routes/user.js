import express from 'express';
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, 
         update,addHistory,addSuggest } from '../controllers/user.js'
import { verifyToken } from '../verifyToken.js';
const router=express.Router();

//update user
router.put("/:id", verifyToken,update)
//delete user
router.delete("/:id",verifyToken,deleteUser)
//get a user
router.get('/find/:id',getUser)
//subscribe a user
router.put("/sub/:id",verifyToken,subscribe)
//unsubscribe a user
router.put("/unsub/:id",verifyToken,unsubscribe)

//like a video
router.put("/like/:videoId",verifyToken,like)
//dislike a video
router.put("/dislike/:videoId",verifyToken,dislike)
// add history to user
router.put("/add/history/:videoId",verifyToken,addHistory)

router.put("/add/suggest/:query",verifyToken,addSuggest)

// router.post("/logout",logout);
export default router;