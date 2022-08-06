import {useContext} from 'react';
import {darkModeContext} from '../App.js';
import styled from 'styled-components'
import logo from '../img/logo.png'
import {Home,ExploreOutlined,SubscriptionsOutlined,
    HistoryOutlined,SettingsOutlined,ReportOutlined,HelpOutlineOutlined, LightModeOutlined,AccountCircleOutlined} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Container = styled.div`
flex:1;
background-color:${({theme})=>theme.bgLighter};
height:100vh;
color:${({theme})=>theme.text};
font-size:14px;
position:sticky;
top:0;
`;
const Wrapper = styled.div`
padding:18px 15px 0px 15px;
`;
const Logo = styled.div`
display:flex;
align-items:center;
gap:5px;
font-weight:bold;
margin-bottom:10px;
`;

const Img= styled.img`
height:22px;
`;
const Item=styled.div`
display:flex;
align-items:center;
gap:20px;
cursor:pointer;
padding:5px 0px;

&:hover{
   background-color:${({theme})=>theme.soft};
}
`;

const Hr=styled.hr`
margin:7px 0px;
border:0.5px solid ${({theme})=>theme.soft}
`;

const Login=styled.div`

`;
const Button=styled.button`
padding:5px 15px;
background-color:transparent;
border:1px solid #3ea6ff;
color:#3ea6ff;
border-radius:3px;
font-weight:500;
margin-top:5px;
cursor:pointer;
display:flex;
align-items:center;
gap:5px;
`;

export default function Menu() {
   const currentUser= useSelector(state=>state.user.currentUser)
   const { darkMode, setDarkMode } = useContext(darkModeContext);
  return (
    <Container>
      <Wrapper>
      <Link to='/' style={{textDecoration:'none', color:'inherit'}}> 
        <Logo>
            <Img src={logo}/>
            RYOTUBE
        </Logo>
      </Link>
      <Link to='/' style={{textDecoration:'none', color:'inherit'}}>
        <Item>
           <Home/>Home
        </Item>
      </Link>
        <Link to='/trends' style={{textDecoration:'none', color:'inherit'}}>
        <Item>
           <ExploreOutlined/>Explore
        </Item>
        </Link>
        {currentUser && 
        <Link to='/subscriptions' style={{textDecoration:'none', color:'inherit'}}>
        <Item>
           <SubscriptionsOutlined/>Subscription
        </Item>
        </Link>}
        
        {currentUser && <Link to='/history' style={{textDecoration:'none', color:'inherit'}}> 
        <Item>
           <HistoryOutlined/>History
        </Item>
        </Link> }
        <Hr/>
        {!currentUser &&
        <>
        <Login>
            Sign in to like videos,comment and subscribe
            <Link to='signin' style={{textDecoration:'none'}}><Button><AccountCircleOutlined/>SIGN IN</Button></Link>
        </Login>
        <Hr/>
        </>}
        <Item>
           <SettingsOutlined/>Setting
        </Item>
        <Item>
           <ReportOutlined/>Report
        </Item>
        <Item>
           <HelpOutlineOutlined/>Help
        </Item>
        <Item onClick={()=>setDarkMode(!darkMode)}>
           <LightModeOutlined/> {darkMode ? 'Light' : 'Dark'} Mode
        </Item>
      </Wrapper>
    </Container>
  )
}
