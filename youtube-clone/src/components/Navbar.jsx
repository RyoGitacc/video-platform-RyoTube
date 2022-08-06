import { AccountCircleOutlined, Logout, Person, SearchOutlined, VideoCallOutlined } from '@mui/icons-material';
import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate,Outlet} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Upload from './Upload';
import {logout} from '../redux/userSlice';
import axios from 'axios';

const Container=styled.div`
flex:7;
background-color:${({theme})=>theme.bg};
position:${(props)=>props.type==='modal' ? 'fixed':'static'};
top:0px;
left:150px;
`;
const NavbarBox= styled.div`
position:sticky;
height:50px;
top:0;
background-color:${({theme})=>theme.bgLighter};
`;
const Wrapper = styled.div`
display:flex;
align-items:center;
justify-content:flex-end;
height:100%;
padding:0px 20px;
position:relative;
`;
const Search = styled.div`
position:absolute; // position absolute gives width 100%
width:40%;
left:0px;
right:0px;
margin:auto;
display:flex;
align-items:center;
justify-content:space-between;
padding:5px;
border:1px solid #ccc;
border-radius:3px;
color:${({theme})=>theme.text};
`;
const Input = styled.input`
border:none;
background-color:transparent;
color:${({theme})=>theme.text};
&:focus{
  outline:none;
}
`;
const Button=styled.button`
padding:5px 15px;
background-color:transparent;
border:1px solid #3ea6ff;
color:#3ea6ff;
border-radius:3px;
font-weight:500;
cursor:pointer;
display:flex;
align-items:center;
gap:5px;
`;

const User = styled.div`
display:flex;
align-items:center;
gap:10px;
font-weight:500;
color:${({theme})=>theme.text}
`;

const Avater=styled.img`
width:32px;
height:32px;
border-radius:50%;
background-color:#999;
`;

const Username=styled.div`
cursor:pointer;
user-select:none;
`;

const Dropdown=styled.div`
 position:fixed;
 top:40px;
 right 5px;
 background-color:${({theme})=>theme.bgLighter};
 color:${({theme})=>theme.text};
 width:150px;
`;

const Item=styled.div`
display:flex;
align-items:center;
padding:8px;
cursor:pointer;
gap:5px;
&:hover{
  background-color:${({theme})=>theme.soft};
 }
`;


export default function Navbar() {
  //const {currentUser}= useSelector(state=>state.user)
  const [open,setOpen]=useState(false);
  const [isOpen,setIsOpen]=useState(false);
  const currentUser= useSelector(state=>state.user.currentUser);
  const dispatch=useDispatch();
  const [q,setQ]=useState("");
  const navigate=useNavigate();

  const handleLogout=async()=>{
    dispatch(logout());
    setIsOpen(false);
    document.cookie="access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    try{
    await axios.post('http://localhost:8800/api/users/logout',
    {},
    // { withCredentials: true, credentials: "include", }
    );
    
    navigate(`/`);
    }catch(err){
      console.log(err);
    }
    
  }
  const goProfilePage=()=>{
    navigate('/profile');
    setIsOpen(false);
  }
  return (
    <>
    <Container type={open ? "modal" : ""}>
     <NavbarBox>
        <Wrapper>
         <Search>
            <Input placeholder='Search' onChange={(e)=>setQ(e.target.value)}/>
            <SearchOutlined onClick={()=>navigate(`/search?q=${q}`)}/>
         </Search>
         {currentUser? (
          <User>
            <VideoCallOutlined onClick={()=>setOpen(true)}/>
            <Avater src={currentUser.img}/>
            <Username onClick={()=>setIsOpen(!isOpen)}>{currentUser.name}</Username>
          </User>
         )
         :(<Link to='signin' style={{textDecoration:'none'}}>
          <Button><AccountCircleOutlined/>SIGN IN</Button>
         </Link>)}
        </Wrapper>
        {isOpen && 
           <Dropdown>
             <Item onClick={goProfilePage}><Person/>Profile</Item>
             <Item onClick={handleLogout}><Logout/>Logout</Item>
           </Dropdown>}
       </NavbarBox>
     <Outlet />
  </Container>
  {open && <Upload setOpen={setOpen}/>}
  
  
    {/* {open && <Upload setOpen={setOpen}/>}
    {isOpen && 
     <Dropdown>
      <Item onClick={goProfilePage}><Person/>Profile</Item>
      <Item onClick={handleLogout}><Logout/>Logout</Item>
     </Dropdown>
    } */}
    
    </>
  )
}
