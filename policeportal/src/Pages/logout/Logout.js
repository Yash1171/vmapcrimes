import React,{useState,useEffect,useContext }from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/userContext'
const Logout = () => {
    const nav = useNavigate()
    const {logUserout} = useContext(UserContext)
    const [ stat, setStat ] = useState()
    useEffect(() => { (async()=> {
        const options= {
            credentials: 'include'
        }
        const logout = await fetch('http://localhost:5001/api/auth/logout',options)
        const logoutRes = await logout.json()
          if(logout.status===401 || logoutRes.status==="success"){
              setStat(true)
              logUserout()
              nav("/login",{replace:true})
          }
      
    })()},[])
  return (
    <div>
      {!stat?<h1> Logging You out ...</h1>:<h1>Logged out Successfully!</h1>}
    </div>
  )
}

export default Logout
