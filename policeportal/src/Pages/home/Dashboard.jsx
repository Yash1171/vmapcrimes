import Featured from "../../components/featured/Featured"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Table from "../../components/table/Table"
import Widget from "../../components/widget/Widget"
import UserContext from "../../context/userContext"
import { useContext,useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import "./dashboard.scss"
import Chart from "../mainwebsite/Chart"
const Dashboard = () => {
 
  const { isAuthenticated,verifyAuth } = useContext(UserContext)
  const [firCount,setFirCount ] = useState(0)
  const [userCount,setUserCount ] = useState(0)

  const nav = useNavigate()
  const fetchCount = async () => {
    var firs = await fetch("http://localhost:5001/api/data/fetchFirCount");
    var firsJSON = await firs.json()
    setFirCount(firsJSON.count)
    const options = {credentials: 'include'}
    var users = await fetch("http://localhost:5001/api/users/fetchUserCount",options);
    console.log(users)
    var usersJSON = await users.json()
    verifyAuth(users,usersJSON)
    setUserCount(usersJSON.count)

  }
  useEffect(()=>{if(!isAuthenticated) {
    console.log("User not authenticated, redirecting to login page")
    nav('/login',{replace:true})
  }
  else {
    fetchCount()

  }
},[isAuthenticated])
  return (
    <>
      {
        isAuthenticated ?
          <div className="home">
            <Sidebar />
            <div className="homeContainer">
              <Navbar />

              <div className="widgets">

                <Widget type="user" users={userCount} />
                <Widget type="fir" firs={firCount}/>
              </div>
              <div className="charts">
              </div>
              <hr />
              <h2 style={{margin:" auto 3rem "}}>Latest Analytics</h2>
              <hr />
              <div style={{margin: "0px 5rem"}}>
                <div style={{display: "flex",gap: "3rem"}}>

             <Chart height={'320px'} width={'500px'} chartId="63eba339-8e54-44c6-873e-e1c32177c364" style={{margin :"0 1.5rem !important"}}/>
             <Chart height={'320px'} width={'500px'} chartId="63eba36a-6ec5-44d0-8111-7aa4ae48fe2e" style={{margin :"0 1.5rem"}}/>
                </div>
                

              </div>
                

            </div>
          </div > : <h3> Redirecting to login page ...</h3>
      }
    </>

  )
}

export default Dashboard
