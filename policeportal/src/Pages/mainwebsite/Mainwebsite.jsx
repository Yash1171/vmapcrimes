import MarkerClusterGroup from 'react-leaflet-cluster'
import "./mainnavbar.scss"
import L from "leaflet"

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import LoginIcon from '@mui/icons-material/Login';
import { DarkModeContext } from "../../context/darkModeContext";
import "./mainwebsite.scss"
import 'leaflet/dist/leaflet.css'
import Icon from "../../location-sign-svgrepo-com.svg";
import RapeIcon from "../../rape-marker.svg"
import MurderIcon from "../../murder-marker.svg"
import TheftIcon from "../../theft-marker.svg"
import KidnapIcon from "../../kidnapping-marker.svg"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Tabmap from './Tabmap';
import MapContext from '../../context/mapContext';
import UserContext from '../../context/userContext';


function Mainwebsite() {

  const { firsDisplayed, setFirsDisplayed, filters,firSelected,setFirSelected } = useContext(MapContext)
  const {isAuthenticated} = useContext(UserContext)

  const fetchData = async () => {
    const options = {
      method: "GET",
      credentials: "include"
    }
    var fetchUri = new URL("http://localhost:5001/api/fetch/fetchFIR")
    if (filters && typeof filters === "object") {
      Object.keys(filters).forEach(key => { return filters[key]?fetchUri.searchParams.append(key, filters[key]):null})
    }
    const mapRes = await fetch(fetchUri, options)
    const mapResJSON = await mapRes.json()
    if (mapResJSON.status === "success") {
      // var firObj = {}
      // const resultParsed = mapResJSON.every((item)=> { firObj[item._id]=item})
      setFirsDisplayed(mapResJSON.result.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      })
      )
    }

  }
  useEffect(() => {

    fetchData()

  }, [filters])
  const { dispatch } = useContext(DarkModeContext)


  const center = {
    lat: 22.5934,
    lng: 79.2223,
  }
  const myicon = L.icon({ iconUrl: Icon, iconSize: L.point(40, 40) })
  console.log("icon is " + myicon.iconUrl)

  return (

    <div className='mainhome'>

      <div className="Navbar" style={{ position: "fixed", padding: "1rem", width: "100%", zIndex: "1111" }}>
        <div className="wrapper">
          <div className="Welcome">VMapCrimes</div>

          <div className="items">
          <div className='item'>
              <Link to="/dashboard" style={{textDecoration:"none"}}>
                <li className='links' style={{color:"white", fontSize: "18px"}}>Dashboard</li>
              </Link>
            </div>
            <div className="item">
              <Link to="/analytics" style={{textDecoration:"none"}}>
                <li className='links' style={{color:"white"}}>Analytics</li>
              </Link> 
            </div>
            <div className="item">
              <DarkModeOutlinedIcon className="icon" onClick={() => dispatch({ type: "TOGGLE" })} />
            </div>


            <Link to="/login">
              <div className="item">
                <LoginIcon className='icon' />
              {isAuthenticated?<Link to="/logout" style={{textDecoration: "none !important"}}>Logout</Link>:<Link to="/login" style={{textDecoration: "none !important "}}>Login</Link>}
                
              </div>
            </Link>


          </div>
        </div>
      </div><br />
      <div className="mapcontain">
        <MapContainer center={center} zoom={4.5} maxZoom={20} scrollWheelZoom={true} style={{ height: "90vh", width: "60vw", padding: "5rem", position: "fixed", }}>
          <MarkerClusterGroup
            chunkedLoading
          >
                 
            {firsDisplayed.map((fir, index) => (
              <Marker
              key={index}
              position={[fir.coords [0], fir.coords[1]]}
              icon={myicon}  
              eventHandlers={{popupopen:()=>{
                setFirSelected(fir)
                console.log(firsDisplayed)
              },popupclose: () => {
                setFirSelected(null)
              }}}            
            >
              <Popup minwidth={80} className="popup">
                
                <ul>
                  {firSelected?firSelected.victim?<li>
                    <p>Victim: <span>{fir.victim}</span> </p>
                  </li>:null:null}
                  {firSelected?firSelected.suspect?
                  <li>
                    <p>Suspect: <span>{fir.suspect}</span> </p>
                  </li>:null:null}
                  <li>
                    <p>CrimeType: <span>{fir.type}</span> </p>
                  </li>
                </ul>

              </Popup>
            </Marker>
            ))}
          </MarkerClusterGroup>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        </MapContainer>

      </div>
      <div className="mapright">
        <div className="right_sidebar">
          <Tabmap />

        </div>
      </div>

    </div>
  )
}

export default Mainwebsite
