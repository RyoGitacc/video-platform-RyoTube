import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,FacebookAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "video-platform-80235.firebaseapp.com",
  projectId: "video-platform-80235",
  storageBucket: "video-platform-80235.appspot.com",
  messagingSenderId: "942738574674",
  appId: "1:942738574674:web:c8484efe96e28db1703e8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const facebookProvider=new FacebookAuthProvider();
export const provider = new GoogleAuthProvider();
export default app;