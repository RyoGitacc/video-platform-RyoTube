import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from './pages/home/Home';
import Video from './pages/video/Video';
import Signup from './pages/signup/Signup';
import Login from "./pages/Login/Login";
import LoginWithEmail from "./pages/loginWIthEmail/LoginWithEmail";
import { useSelector } from "react-redux";




function App() {
  const {currentUser}=useSelector(state=>state.user)

  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home type="random"/>}/>
        <Route path="/trend" element={<Home type="trend"/>}/>
        <Route path="/subscription" element={<Home type="sub"/>}/>
        <Route path='/login' element={currentUser ? <Navigate to='/' />:<Login/>}/>
        <Route path='/login/email' element={currentUser ? <Navigate to='/' />:<LoginWithEmail/>}/>
        <Route path='/signup' element={currentUser ? <Navigate to='/' />:<Signup/>}/>
        <Route path='/video' element={<Video/>}/>
        <Route path='/history' element={<Home type="history"/>}/>
        <Route path='/result' element={<Home type="result"/>}/>
    </Routes>
    </BrowserRouter>
  );


}

export default App;
                                                                            