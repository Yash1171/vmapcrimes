import "./navbar.scss"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import jwt from 'jwt-decode'

function Navbar() {
  const{dispatch} = useContext(DarkModeContext)
  const [auth , setAuth] = useState(false)
  const [user, setUser ] = useState({})

  useEffect(()=> {
    if(document.cookie.indexOf('auth-token=') === -1) {
      setUser({name:"Guest"})
      return
    }else{
      var cookies = document.cookie.split(";")
      // console.log("Cookies: "+cookies)

      var cookiesParsed=cookies.filter((item)=>{return item.indexOf('auth-token=') !== -1} ) // returns array [['name1','value1']...]
      // console.log("Cookies Parsed: "+cookiesParsed)
      var authToken = cookiesParsed[0].split("=")[1]
      var authuser = jwt(authToken)
      console.log("User : "+JSON.stringify(authuser))
      setUser(authuser)
      setAuth(true)
    }

  },[])

  return (
    
      <div className="Navbar">
        <div className="wrapper">
        <div className="Welcome">Dashboard | {auth?user.username:"App User"}</div>
          
          <div className="items">
            
            <div className="item">
              <DarkModeOutlinedIcon className="icon" onClick={()=>dispatch({type:"TOGGLE"})}/>
            </div>
            
            
            <div className="item">
              <img src="https://static.thenounproject.com/png/2643367-200.png"
              alt="admin"
              className="avatar"/>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Navbar
