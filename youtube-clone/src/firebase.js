import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyBJKQVQ3nl0odrutzKAQbKLP1KfYxFL8Mk",
  authDomain: "video-1efda.firebaseapp.com",
  projectId: "video-1efda",
  storageBucket: "video-1efda.appspot.com",
  messagingSenderId: "894308385247",
  appId: "1:894308385247:web:19ca16fa29d9e253b5046a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;