import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import Datatable from "../../components/datatable/Datatable";
import { useNavigate, useParams } from "react-router-dom";
import { useState,useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";
import img from "../../default-avatar.jpg"
const Single= () => {
  const {isAuthenticated,verifyAccess} = useContext(UserContext)
  const {userId}  = useParams();
  const [user, setUser] = useState({name: "App User"})
  const nav = useNavigate()
  const fetchUser = async () => {
    const options = {
      credentials: 'include'
    }
    var fetchedUser = await fetch(`http://localhost:5001/api/users/fetchUser/${userId}`,options)
    var fetchedUserJSON = await fetchedUser.json()
    setUser(fetchedUserJSON)
  }
  
  useEffect ( ()=> {
    if(isAuthenticated){
      fetchUser()
    }else{
        nav("/login",{replace: true})
    
    }
  },[userId])
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {verifyAccess({ACTION_PERMS:"EDIT_USER"})?<Link to={`../update/${userId}`} ><div className="editButton">Edit</div></Link>:null}
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={img} 
              // https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500
              alt="" 
              className="itemImg"/>
              <div className="details">
                <h1 className="itemTitle">{user?user.name:null}</h1>
                <div className="detailItem">
                  <span className="itemkey">Email:</span>
                  <span className="itemValue">{user?user.email:null}</span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">Phone:</span>
                  <span className="itemValue">{user ?user.phone:null}</span>
                </div>
                <div className="detailItem">
                  <span className="itemkey">Address:</span>
                  <span className="itemValue">{user ?user.address:null}</span>
                </div>
               
              </div>
            </div>
          </div>
          
        </div>
        <div className="bottom">
          <Datatable/>
        </div>
      </div>
    </div>
  )
}

export default Single
