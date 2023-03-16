import express from 'express';
import { addComment, getComments } from '../controllers/comment.js'
import { verifyToken } from '../verifyToken.js';
const router=express.Router();

router.post("/add",verifyToken,addComment); // I will implement them when having a freetime
// router.delete("/delete/:id",verifyToken,deleteComment);
router.get("/get/:videoId",getComments)


export default router;