import React, { useState, useContext, useEffect } from 'react';
import "./Login.css";
import { useNavigate,Link } from 'react-router-dom';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UserContext from '../context/userContext';

const Login = () => {
    // eslint-disable-next-line
    const {isAuthenticated,setIsAuthenticated} = useContext(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted,setSubmitted] = useState(false)
    const [loginErr,setLoginErr] = useState("")
useEffect(()=>{
    setSubmitted(false)
    if(isAuthenticated){
        navigate("/dashboard",{replace: true})
    }

},[])

    const handleFormSubmit = async ( e ) => {
       
        e.preventDefault()
        const postData = {email,password}
        const options= {
            method : 'POST',
            headers: {"Content-type" :"application/json"},
            body: JSON.stringify(postData)
        }
        var sendLogin= await fetch('http://localhost:5001/api/auth/login',options)
        var loginRes = await sendLogin.json()
        if(loginRes && loginRes.status && loginRes.status==="failure") {
            console.log("Setting Errors to "+JSON.stringify(loginRes.message))
            setLoginErr(loginRes.message.errors)
        }else {
            setIsAuthenticated(true)
            navigate("/", {replace:true})
            document.cookie=`auth-token=${loginRes.result.auth}`
        }
        setSubmitted(true)
    }

    return(
       
        <div className='Header'>

        <div className='login'>
            <form className='login_form' >
                <h1>Police Login <VpnKeyIcon/></h1>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type='submit' onClick={handleFormSubmit} className='submit__btn'>Login</button>
                {submitted?loginErr?<span style={{color:"red"}}>Login failed {loginErr?<><ul>{loginErr.map((item)=><li>{item.param+": "+item.msg}</li>)}</ul></>:null}</span> :null:null}
                <Link to="/" style={{textDecoration:"none",marginTop:"2rem",fontSize:"1.5rem"}}>Continue to main page...</Link>

            </form>

        </div>
        </div>
    )
}

export default Login
