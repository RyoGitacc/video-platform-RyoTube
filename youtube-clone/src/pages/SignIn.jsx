import axios from 'axios';
import React, { useState } from 'react'
import styled from 'styled-components';
import { useDispatch} from 'react-redux';
import {loginStart,loginSuccess,loginFailure} from '../redux/userSlice';
import {auth,provider} from '../firebase';
import {signInWithPopup} from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

const Container=styled.div`
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
height:calc(100vh - 56px);
color:${({theme})=>theme.text};
`;

const Wrapper=styled.div`
display:flex;
align-items:center;
flex-direction:column;
background-color:${({theme})=>theme.bgLighter};
border:1px solid ${({theme})=>theme.soft};
// padding:20px 50px;
padding:3px 50px;
gap:10px;
`;

const Title=styled.h1`
font-size:24px;
`;
const SubTitle=styled.h2`
font-size:20px;
font-weight:300;
`;
const Input=styled.input`
border:1px solid ${({theme})=>theme.soft};
color:${({theme})=>theme.text};
border-radius:3px;
padding:10px;
background-color:transparent;
width:100%;
`;
const Button=styled.button`
border-radius:3px;
border:none;
padding:10px 20px;
font-weight:500;
cursor:pointer;
background-color:${({theme})=>theme.soft};
color:${({theme})=>theme.textSoft};
`;
const More=styled.div`
display:flex;
margin-top:10px;
font-size:12px;
color:${({theme})=>theme.textSoft};
`;
const Links=styled.div`
margin-left:40px;
`;
const Link=styled.span`
margin-left:30px;
`;
export default function SignIn() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleLogin=async (e)=>{
   e.preventDefault();
   dispatch(loginStart());
   try{
      const res=await axios.post("http://localhost:8800/api/auth/signin",{name,password}, {withCredentials:true});
      dispatch(loginSuccess(res.data));
      navigate("/");
   }catch(err){
      dispatch(loginFailure());
   }
  }

  const signInWithGoogle=async()=>{
    loginStart();
    signInWithPopup(auth,provider).then((result)=>{
      axios.post('http://localhost:8800/api/auth/google',{
        name:result.user.displayName,
        email:result.user.email,
        img:result.user.photoURL,
      },{withCredentials:true}).then(res=>{
        dispatch(loginSuccess(res.data))
        navigate("/");
      })
    })
  .catch((err)=>{
    console.log(err);
       dispatch(loginFailure());
    })
  }

  const handleSignup=async()=>{
    const user={
      name:name,
      email:email,
      password:password
    }
    try{
      await axios.post("http://localhost:8800/api/auth/signup",user);
      setName("");
      setEmail("");
      setPassword("");
    }catch(err){
    console.log(err);
    }
  }
  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to RYOTUBE</SubTitle>
        <Input placeholder='username' onChange={(e)=>setName(e.target.value)}/>
        <Input type='password' placeholder='password' onChange={(e)=>setPassword(e.target.value)}/>
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Sign in with google</Button>
        <SubTitle>You don't have an account?</SubTitle>
        {/* <Title>Sign Up</Title> */}
        <Input placeholder='username' value={name} onChange={(e)=>setName(e.target.value)}/>
        <Input type='email' placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <Input type='password' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <Button onClick={handleSignup}>Sign Up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
        <Link>Help</Link>
        <Link>Privacy</Link>
        <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  )
}
