import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import {EditOutlined} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { update } from '../redux/userSlice';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase';
import toronto from '../img/Toronto.jpg'
import logo from '../img/logo.png'

const Container = styled.div`
width:100vw;
height:100vh;
background-color:#181818;
display:flex;
justify-content:center;
`;
const Logo = styled.div`
display:flex;
align-items:center;
gap:5px;
font-weight:bold;
margin-bottom:10px;
position:absolute;
top:30px;
left:30px;
color:white;
`;

const Img= styled.img`
height:30px;
`;

const Wrapper=styled.div`
width:400px;
height:100%;
background-color:#181818;
`;

const Title=styled.h1`
color:transparent;
font-size:50px;
font-weight:400;
border-bottom:1px solid #aaaaaa;
margin-bottom:15px;
`;

const Span=styled.span`
background:linear-gradient(180deg, grey 40%, white);
-webkit-background-clip: text;
`
const InputsWrapper=styled.div`
display:flex;
gap:15px;
padding-bottom:60px;
border-bottom:1px solid #aaaaaa;
`;

const Label = styled.label`
position:relative;
color:white;
`;
const UserImg=styled.img`
width:120px;
height:120px;
border-radius:50%;
`;

const EditIcon=styled.div`
width:25px;
height:25px;
border-radius:50%;
background-color:#181818;
position:absolute;
top:80px;
left:20px;
display:flex;
align-items:center;
justify-content:center;
`;
const Inputs=styled.div`
width:100%;
background-color:inherit;
`;

const InputWrapper=styled.div`
border-bottom:1px solid #aaaaaa;
margin-bottom:15px;
padding-bottom:60px;
`;

const Input=styled.input`
width:100%;
height:35px;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
box-sizing: border-box;
background-color:#008B8B;
border:none;
border-radius:3px;
margin-top:5px;
cursor:text;
color:white;
font-size:20px;
padding:10px;

&:focus{
    outline:none;
}
`;

const FileInput=styled.input`
display:none;
`;

const Buttons=styled.div`
width:100%;
display:flex;
justify-content:flex-end;
align-items:center;
padding-top:10px;
gap:10px;
`;
const Button=styled.button`
width:60px;
height:35px;
border-radius:3px;
color:${(props)=>props.type==='save' ? 'black':'#aaaaaa'};
border:none;
background-color:${(props)=>props.type==='save' ? 'white':'#202020'}
`;

export default function Profile() {
const currentUser= useSelector(state=>state.user.currentUser);
const [name,setName]=useState(currentUser.name);
const [email,setEmail]=useState(currentUser.email);
const [img,setImg]=useState(null);
const [uploadedImg,setUploadedImg]=useState(currentUser.img);
const dispatch=useDispatch();
const navigate=useNavigate();
const access_token=document.cookie.split('=')[1]


const uploadFile=(file)=>{
  const storage = getStorage(app);
  const filename = new Date().getTime() + file.name;
  const storageRef = ref(storage,filename);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed',
  (snapshot) => {
      switch (snapshot.state) {
           case 'paused':
            console.log('Upload is paused');
            break;
           case 'running':
            console.log('Upload is running');
            break;
            default:break;
         }
}
,(error) => {},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setUploadedImg(downloadURL);
  })
})

};

useEffect(()=>{
  img && uploadFile(img);
 },[img]);

 
const handleCancel=()=>{
navigate('/');
}

const handleSave=async()=>{
  try{
  const updatedUser=  await axios.put(`https://simple-youtube.herokuapp.com/api/users/${currentUser._id}`,{name:name,email:email,img:uploadedImg,access_token:access_token});
  dispatch(update(updatedUser.data));
  navigate('/');
  }catch(err){
    console.log(err);
  }
}
  return (
    <Container>
      <Logo>
            <Img src={logo}/>
            RYOTUBE
        </Logo>
      <Wrapper>
        <Title><Span>Edit Profile</Span></Title>
        <InputsWrapper>
         <Label htmlFor='file'>
           <UserImg src={ uploadedImg ? uploadedImg : currentUser.img ? currentUser.img : toronto}/>
           <EditIcon><EditOutlined sx={{color:'white'}}/></EditIcon>
         </Label>
         <FileInput type='file' id="file" accept='image/*'onChange={(e)=>setImg(e.target.files[0])}/>
        <Inputs>
        <InputWrapper>
          <Label>Name:</Label>
          <Input type='text' value={name} onChange={e=>setName(e.target.value)}/>
        </InputWrapper>
        <InputWrapper>
          <Label>Email:</Label>
          <Input type='email' value={email} onChange={e=>setEmail(e.target.value)}/>
        </InputWrapper>
          <Label>Password:</Label>
          <Input type='password' disabled/>
        </Inputs>
        </InputsWrapper>
        <Buttons>
            <Button onClick={handleCancel}  type='cancel'>Cancel</Button>
            <Button onClick={handleSave} type='save'>Save</Button>
        </Buttons>
      </Wrapper>
    </Container>
  )
}
