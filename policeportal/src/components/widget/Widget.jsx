import "./widget.scss"
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CrisisAlertRoundedIcon from '@mui/icons-material/CrisisAlertRounded';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import { Link } from "react-router-dom";

function Widget({type="user",users=0,firs=0}) {
  let data;


  switch (type) {

    case "user":
      data ={
        title: "USERS",
        isMoney: false,
        linkText: "See all users",
        link:"/users",
        counter:parseInt(users),
        icon: <PersonRoundedIcon className="icon" 
        style={{color:"green", backgroundColor: "lightgreen",
       }}
        />,
      };
      break;
     
      case "fir":
      data ={
        title: "FIR Registered",
        isMoney: false,
        link:"/",
        linkText: "View all Fir",
        counter:parseInt(firs),
        icon: <NoteAltOutlinedIcon className="icon"
        style={{color:"darkgoldenrod", backgroundColor: "rgba(218, 165,32, .2)",
       }}
        />,
      };
      break;

    default:
      break;
  }


  return (
    
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.counter}</span>
        <span className="link"><Link to={data.link} style={{textDecoration:"none !important"}}>{data.linkText}</Link></span>       
      </div>
      <div className="right">
        <div className="percentage positive">
            <KeyboardArrowUpRoundedIcon/>
             25 %
        </div>
        {data.icon}      
      </div>
    </div>
  )
}

export default Widget
