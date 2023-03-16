import express from 'express';
import { AuthByProvider, signin, signup } from '../controllers/auth.js'


const router=express.Router();

//Create a user
router.post('/signup',signup)

router.post('/signin',signin)

router.post('/google',AuthByProvider)

export default router;