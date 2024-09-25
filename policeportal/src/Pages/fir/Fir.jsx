import "./fir.scss"
import { useState, useEffect, useContext } from 'react'
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { State, City } from 'country-state-city';
import { MapContainer, TileLayer } from "react-leaflet"
import DraggbleMarker from "../../components/Markers/DraggbleMarker"
import UserContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { setRef } from "@mui/material";

const Fir = () => {
  const { isAuthenticated, verifyAuth, verifyAccess } = useContext(UserContext)
  const [latlong, setLatLong] = useState({ lat: 0.00, lng: 0.00 });
  const [cities, setCities] = useState([{ name: '' }])
  const [state, setState] = useState()
  const [toggleState, setToggleState] = useState(1);
  const states = State.getStatesOfCountry("IN")
  const [data, setData] = useState();
  const [timestamp, setTimeStamp] = useState({ date: "", min: "", hr: "" })
  const [crimeDate, setCrimeDate] = useState(" ")
  const nav = useNavigate()
  const [errs, setErrs] = useState()
  const [submitted,setSubmitted] = useState(false)
  const [submitErr,setSubmitErr] = useState()

  const handleFormSubmit = async (e) => {

    e.preventDefault()

    // setting errors 

    const req_fields = ['Victim_Name', 'Officers_Name',
      'Address',
      'Zip',
      'Contact_Number',
      'Relation_with_accused',
      'Name_of_accused',
      'Type_of_incident',
      'Incident_Highlight',
      'Incident_details',
      'Penal_code',
      'Crime_City',
      'Crime_State',
      'Timestamp_of_Crime']
    var newErrs
    req_fields.every(async (i) => {
      if (!data.hasOwnProperty(i)) {
        newErrs = { ...newErrs, [i]: true }
      }
      return true
    })
    setErrs(newErrs)
    console.log(newErrs)
    if (!newErrs) {

      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type': "application/json"
        },
        body: JSON.stringify(data)
      }

      const postRes = await fetch(
        'http://localhost:5001/api/data/uploadFir', options
      )
      const postResJSON = await postRes.json()
      if (!verifyAuth(postRes, postResJSON)) {
        nav('/logout',{replace:true})
      }else{
        if(postResJSON.status==="failure") {
          setSubmitErr(postResJSON.message.errors?postResJSON.message.errors:postResJSON.message)
          console.log(submitErr)
          
        }
      }
    }

  }

  const makeDate = (ts) => {

    const { date, hr, min } = ts
    return date + "T" + (hr ? hr.length === 2 ? hr : "0" + hr : "00") + ":" + (min ? min.length == 2 ? min : "0" + min : "00") + ":00"

  }

  const dateSet = (e) => {
    var ts = { ...timestamp }
    ts.date = e.target.value
    setTimeStamp(ts)
  }

  const minChange = (e) => {
    var ts = { ...timestamp }
    ts.min = e.target.value
    setTimeStamp(ts)
  }
  const hrChange = (e) => {
    var ts = { ...timestamp }
    ts.hr = e.target.value
    setTimeStamp(ts)
  }

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const stateSelected = (e) => {
    var stateCode = e.target.value.split('-')[1]
    setState(stateCode)
    setData({ ...data, Crime_State: e.target.value.split('-')[0] })
  }
  const citySelected = (e) => {
    setData({ ...data, Crime_City: e.target.value })
  }

  useEffect(() => {
    if (!isAuthenticated) {
      nav("/login", { replace: true })
    }
    setErrs("")
    setSubmitErr("")
    if(timestamp.date){

      console.log("Setting TimeStamp in data")
      setCrimeDate(makeDate(timestamp))

    }

    const newData = { ...data, Timestamp_of_Crime: makeDate(timestamp) }
    setData(newData)
    setCrimeDate(makeDate(timestamp))

    // wrapping async call in a promise
    setCities(City.getCitiesOfState('IN', state))
    const getPosition = () => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });
    }

    setData({ ...newData, Location: { type: "Point", coordinates: [latlong.lat, latlong.lng] } })
    // awaiting for the promise
    const returnUserPos = async () => {
      var position = await getPosition();  // wait for getPosition to complete
      console.log(position)
      let { coords } = position;

      let { latitude, longitude } = coords;

      let nll = { lat: latitude, lng: longitude }
      setLatLong(nll);
      setData({ ...newData, Location: { type: "Point", coordinates: [latlong.lat, latlong.lng] } })
    }
    if (latlong.lat === 0.0) {
      returnUserPos()
    }


  }, [latlong, state, timestamp])


  return (
    <div className="Fir">
      <Sidebar />
      <div className="fircontainer">
        <Navbar />
        <div className="header">

          <div className="container">
            
            {verifyAccess({ ACTION_PERMS: ["CREATE_FIR"] }) ? <>

            <div className="left">
              <h2>FIR FORM</h2>
              <form>

                {errs && errs.Name_of_accused ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}

                Name of accused:
                <input type="text" placeholder="Enter the Name" name="Name_of_accused" onChange={handleChange} id="Accused_name" />
                {errs && errs.Timestamp_of_Crime ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}

                Date of Crime:
                <input type="date" placeholder="Date" onChange={dateSet} id="Date" />
                Time of Incidence<br />
                (hrs)<input type="number" id="quantity" name="quantity" onChange={hrChange} min="0" max="23" style={{ display: "inline", width: "60px", margin: "0px 15px" }} />(mins)<input type="number" id="quantity" onChange={minChange} name="quantity" min="0" max="59" style={{ display: "inline", width: "60px", margin: "0px 15px" }} />
                <div className="Zip">



                  <label>
                  {errs && errs.Type_of_incident ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}
                    Type of Incident:
                   
                    <select style={{ border: "none", borderBottom: "2px solid blue" }} name="Type_of_incident" onChange={handleChange}>
                      <option>Choose Options</option>
                      <option>Murder</option>
                      <option>Robbery</option>
                      <option>Theft</option>
                      <option>Rape</option>
                      <option>Kidnapping</option>
                      <option>Harrasment</option>
                      <option>Others</option>
                    </select>
                  </label>

                  <label>
                    {errs && errs.Zip ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}

                    Incident Zip:
                    <input type="number" onChange={handleChange} name="Zip" placeholder="Enter Zip" id="Zip_code" />
                  </label>
                </div>

                Weapons Used:
                <input type="text" placeholder="weapons used.." onChange={handleChange} name="Weapons_Used" id="weapon" /><br />

                <label style={{ fontSize: "20px", display: "grid", fontWeight: "500" }}>State<br />
                  <select className="state_city" onChange={stateSelected}><option value="">Select a State</option> {states.map(stateItem => (
                    <option key={stateItem.isoCode} id={stateItem.isoCode} value={`${stateItem.name}-${stateItem.isoCode}`}>{stateItem.name}</option>
                  ))}
                  </select>
                </label><br />
                <label style={{ fontSize: "20px", fontWeight: "500" }}>City<br />
                  <select className="state_city" onChange={citySelected}>{cities ?
                    <option value="">Select a City</option>
                    : null} {cities.map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </label>


                <br /><br />

                <span>
                  <a className="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Penal Code ⮟
                  </a>

                </span>

                <div className="collapse" id="collapseExample">
                  <div className="card card-body">
                    {errs && errs.Penal_code ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}

                    <input type="text" required={true} placeholder="Penal Code.." name="Penal_code" onChange={handleChange} style={{ textDecoration: "none", border: "2px solid blue", padding: "5px", fontSize: "1rem", borderRadius: "2px" }} />
                    121, 141, 144, 146, 147, 148, 151, 153-A, 295-A, 268, 302, 304-B, 307, 322, 324, 351, 354, 509, 498-A, 363, 364, 365, 366, 376, 379, 380, 383, 390, 391, 392,395, 396, 397,411, 420, 441, 442, 447,448,454, 457, 465, 467,468,470,471, 489-A, 504,506
                  </div>
                </div>
              </form>
            </div>
              <div className="right">
                <h3>Applicant's Details:</h3>

                <form>
                  {errs && errs.Victim_Name ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}
                  Name:
                  <input type="text" onChange={handleChange} name="Victim_Name" placeholder="Enter Victim's/Informant's Name" id="Name" />
                  {errs && errs.Officers_Name ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}
                  Name of Police Officer:
                  <input type="text" onChange={handleChange} name="Officers_Name" placeholder="Officer's Name" id="Par_name" />
                  {errs && errs.Address ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}
                  Address:
                  <input type="text" onChange={handleChange} name="Address" placeholder="Enter Your Address" id="address" />
                  {errs && errs.Contact_Number ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}
                  Contact No.:
                  <input type="number" onChange={handleChange} name="Contact_Number" placeholder="Enter Ph No." id="cont_no" />
                  {errs && errs.Relation_with_accused ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}
                  Relation with Accused:
                  <input type="text" onChange={handleChange} name="Relation_with_accused" placeholder="Relation" id="Relation" />
                  {errs && errs.Incident_Highlight ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}

                  Incident Highlight:
                  <input type="text" onChange={handleChange} name="Incident_Highlight" placeholder="Enter the highlights.." id="Inci_high" />
                  {errs && errs.Incident_details ? <p style={{ color: "red !important" }}>This field can not be empty</p> : null}

                  Incident details:
                  <input type="text" onChange={handleChange} name="Incident_details" placeholder="Enter the details.." id="Inci_det" />

                  {latlong.lat ? <><label style={{ marginTop: "8px" }}><b>Drag the marker to select the place of crime</b></label><MapContainer center={latlong} zoom={13} scrollWheelZoom={true} style={{ height: "20rem", width: "auto" }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=elXXra8KVLZtccfmuC0Y"
                    />
                    <DraggbleMarker latlong={latlong} setLatLong={setLatLong} />
                  </ MapContainer></> : <h3> Trying to fetch station location, Please make sure to allow location for this site </h3>}

                  <input type="hidden" value={latlong.lat} id="lat" />
                  <input type="hidden" value={latlong.lng} id="long" />

                  <input type="submit" value="Submit" onClick={handleFormSubmit} id="Submit" />
                  { submitted?submitErr?Array.isArray(submitErr) ?<span style={{color:"red"}}><ul>{submitErr.map((item)=><li>{item.param+": "+item.msg}</li>)}</ul></span> :submitErr:null:null}
                </form>
              </div>
             
            </>: <h3>You don't have permissions to register an FIR</h3> }
            </div>
        </div>
      </div>
    </div>
  )
}

export default Fir
