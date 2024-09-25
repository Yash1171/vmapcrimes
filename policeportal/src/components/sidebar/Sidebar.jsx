import "./sidebar.scss"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import UserContext from "../../context/userContext";


function Sidebar() {
    const {isAuthenticated,verifyAccess} = useContext(UserContext)
    const{dispatch} = useContext(DarkModeContext)
  return (
    <div className="sidebar">
        <div className="top">
            <Link to="/" style={{textDecoration:"none"}}>
              <span className="Logo">VMapCrimes</span>
            </Link>
            
        </div>
        
        <div className="center">
            <ul>
                <p className="title">MAIN</p>
                <Link to="/dashboard" style={{textDecoration:"none"}}>
                <li>
                     <DashboardIcon className="icon" />
                    <Link to="/analytics" style={{textDecoration:"none"}}><span>Analytics</span></Link>
                </li>
                </Link>
                
                <p className="title">LIST</p>
                {verifyAccess({READ_PERMS:["READ_ALL_USERS"]})?
                <Link to="/users" style={{textDecoration:"none"}}>
                   <li>
                     <PersonOutlinedIcon className="icon" />
                    <span>Users</span>
                </li>
                
                </Link> :null}
                {verifyAccess({READ_PERMS:["READ_ALL_ROLES"]})?
                <Link to="/roles" style={{textDecoration:"none"}}>
                   <li>
                     <PersonOutlinedIcon className="icon" />
                    <span>Roles</span>
                </li>
                
                </Link> :null}
                
            {verifyAccess({ACTION_PERMS:["CREATE_FIR"]})?<><p className="title">FIR</p>
                <Link to="/fir" style={{textDecoration:"none"}}>
                <li>
                     <NoteAltOutlinedIcon className="icon" />
                    <span>FIR Register</span>
                </li>
                </Link>
                <Link to="/location" style={{textDecoration:"none"}}>
                
                </Link></> :null}
                
                
                
                <p className="title">USER</p>
                <li>
                     <ExitToAppIcon className="icon" />
                    {isAuthenticated?<Link to="/logout" style={{textDecoration:"none"}}><span>Logout</span></Link>:<Link to="/login" style={{textDecoration:"none"}}><span>Login</span></Link>}
                </li>
            </ul>
        </div>
        <div className="bottom">
            <div className="colorOptions" onClick={()=> dispatch({type:"LIGHT"})}></div>
            <div className="colorOptions" onClick={()=> dispatch({type:"DARK"})}></div>
            
        </div>
    </div>    
  )
}

export default Sidebar;
