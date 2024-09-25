import React from 'react'

import "./analytics.scss"
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { Link } from "react-router-dom";
import { useContext } from "react";
import LoginIcon from '@mui/icons-material/Login';
import { DarkModeContext } from "../../context/darkModeContext";
import "./mainwebsite.scss"
import 'leaflet/dist/leaflet.css'
import Chart from './Chart'
import MapState from "../../context/MapState"
import MapContext from '../../context/mapContext';
const Analytics = () => {
    const{dispatch} = useContext(DarkModeContext)
    // const {filters} = useContext(MapContext)
  return (
    <div className='mainhome'>
      
      <div className="Navbar" style={{position:"fixed", padding:"1rem", width:"100%", zIndex:"1111"}}>
        <div className="wrapper">
        <Link to="/" style={{textDecoration:"none"}}>
          <div className="Welcome">VMapCrimes</div>
        </Link>
          
          <div className="items" style={{listStyle:"none"}}>
            <div className='item'>
              <Link to="/dashboard" style={{textDecoration:"none"}}>
                <li style={{textDecoration:"none",color:"white"}} className='links' >Dashboard</li>
              </Link>
            </div>

            

            <div className="item">
              <Link to="/analytics" style={{textDecoration:"none"}}>
                <li className='anal_'>Analytics</li>
              </Link> 
            </div>

            <link to="/"></link>
            <div className="item">
              <DarkModeOutlinedIcon className="icon" onClick={()=>dispatch({type:"TOGGLE"})} />
            </div>
            
            
            <Link to="/login">
              <div className="item">
                <LoginIcon className='icon'/>
              </div>
            </Link> 
            
            
          </div>
        </div>
      </div><br/><br/>
      <h4 style={{padding:".5rem 40rem", fontWeight:"550", 
      justifyContent:"center", alignContent:"center", color: "white"}}>Analytics<hr style={{width:"6.5rem", height:"5%",borderColor:"white"}}/></h4>
      <MapState>
      <div className="all_chrts">
        <div className="chartitem">
          <Chart  height={'400px'} width={'520px'} chartId={'63eba339-8e54-44c6-873e-e1c32177c364'}/> 
          <Chart  height={'400px'} width={'620px'} chartId={'63eba36a-6ec5-44d0-8111-7aa4ae48fe2e'}/>
        </div>
        <div className="chartitem">
          <Chart  height={'400px'} width={'520px'} chartId={'63eba6f6-e42b-4168-8f4a-40533504b21e'}/>
          <Chart  height={'400px'} width={'520px'} chartId={'63eba713-28ca-4801-83e8-143058441175'}/>
        </div>
        <div className="chartitem">
          <Chart  height={'400px'} width={'520px'} chartId={'63eba617-8e54-484f-83d2-e1c3217c5f38'}/>
          <Chart  height={'400px'} width={'520px'} chartId={'63eba642-6ec5-4820-8d14-7aa4ae4e656c'}/>
        </div>
        <div className="chartitem">
          <Chart  height={'400px'} width={'520px'} chartId={'63eba49f-e42b-4c0e-8761-405335ffdd40'}/>
          <Chart  height={'400px'} width={'520px'} chartId={'63eba4d6-1d7c-44be-8acb-780c6cda5fa7'}/>
        </div>
        <div className="chartitem">
          {/* <Chart  height={'400px'} width={'620px'} chartId={''}/> */}
          <Chart  height={'400px'} width={'520px'} chartId={'63eba762-8fc6-49b7-8ec0-aa0c569884a7'}/>
        </div>
       
      </div>
      </MapState>
        
    </div>
      
    
  )
}

export default Analytics
