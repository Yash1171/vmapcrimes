import { useState, useEffect, useContext } from "react";
import "./tabmap.css";
import SearchIcon from '@mui/icons-material/Search';

import { State, City } from 'country-state-city';
import MapContext from "../../context/mapContext";
import UserContext from "../../context/userContext";

// Import Interfaces`


function Tabmap() {
  const {authuser} = useContext(UserContext)
  const { filters, setFilters,firSelected,firsDisplayed} = useContext(MapContext)
  const [cities, setCities] = useState([{ name: '' }])
  const [state, setState] = useState()
  const [city, setCity] = useState()
  const [toggleState, setToggleState] = useState(1);
  const states = State.getStatesOfCountry("IN")
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const onChange = (e) => {

    setFilters({...filters,[e.target.name]:e.target.value})
    console.log(filters)
  }

  useEffect(() => {
    console.log("state is now: " + state); 
    const newFilters = {...filters,state,city}
    console.log("New Filters: "+JSON.stringify(newFilters))
    setFilters(newFilters)
  }, [state,city])


  const stateSelected = async (e) => {
    var stateVal=e.target.value
    var stateCode = stateVal? stateVal.split('-')[1] : ""
    if(!stateCode) {
      setCity("")
    }
    setCities(City.getCitiesOfState('IN',e.target.value.split('-')[0]));
    setState(stateCode)
  }

  return (
    <div className="containing" style={{ position: "" }}>
      <div className="bloc-tabs" >
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          <span className="spanning">Reports</span>
        </button>
        
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          <span className="spanning">Filters</span>
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          <span className="spanning">Timeline</span>
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <h2 className="spanning">Reports</h2>
          <hr />
          <span>
            {/* TODO: implement RBAC here */}
            {firSelected?<>
            <h4 style={{color:"green"}}>Highlight</h4>
            <span><h5>{"["+firSelected.type +"] "+ firSelected.highlight}</h5></span><br />
            <h4 style={{color:"green"}}>Address</h4>
            <span><h5>{firSelected.address+", "+firSelected.crimeCity+", "+firSelected.crimeState+", "+firSelected.zip}</h5></span><br />
            <h4 style={{color:"green"}}>Date & Time</h4>
            <span><h5>{firSelected.timestamp.split("T")[0] +" At "+firSelected.timestamp.split("T")[1].split('.')[0]}</h5></span><br />
            <h4 style={{color:"green"}}> Penal Code</h4>
            <span><h5>{firSelected.penalCode}</h5></span><br />
            {firSelected.details?<>
            <h4 style={{color:"green"}}> Crime Details</h4>
            <span><h5>{firSelected.details}</h5></span><br /></>:null}
            {firSelected.suspect?<>
            <h4 style={{color:"green"}}> Name of Accused</h4>
            <span><h5>{firSelected.suspect}</h5></span><br /></>:null}
            {firSelected.victim?<>
            <h4 style={{color:"green"}}> Name of Victim</h4>
            <span><h5>{firSelected.victim}</h5></span><br /></>:null}
            {firSelected.relation?<>
            <h4 style={{color:"green"}}> Relation with Accused</h4>
            <span><h5>{firSelected.relation}</h5></span><br /></>:null}
            {firSelected.weapon?<>
            <h4 style={{color:"green"}}> Weapon Used</h4>
            <span><h5>{firSelected.weapon}</h5></span><br /></>:null}
           
            
            </>:"Click on a marker to view report details"}
          </span>
        </div>


        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <h2 className="spanning">Filters</h2>
          <hr />
          <span>
            <form >
              <select className="filter" name="crimeType" onChange={onChange}>

                <option value="">Choose Options</option>
                <option>Murder</option>
                <option>Robbery</option>
                <option>Theft</option>
                <option>Rape</option>
                <option>Kidnapping</option>
                <option>Harrasment</option>
                <option>Others</option>

              </select>
              <br />
              <br />
              {(authuser && authuser.read_perms && authuser.read_perms.includes("CRIME_DETAILS")) || (authuser && authuser.rolename && authuser.rolename === "admin") ? <>
              <div className="Searchtype">
                <h2 className="spanning">Search <SearchIcon style={{ fontSize: "20px" }} /><hr /></h2>

                <input type="search" placeholder="Search here.." name="textSearch" className="inputsearch" onChange={onChange} />
              </div></>: null}
              <div className="dates">
                <label style={{ display: "grid", fontSize: "18px" }}>Date Before:<input type="date" name="dateBefore" className="dd_mm" onChange={onChange} /></label>
                <label style={{ display: "grid", fontSize: "18px" }}>Date After:<input type="date" name="dateAfter" className="dd_mm" onChange={onChange} /></label>
              </div>
              <div className="codes">
                <label style={{ display: "grid", fontSize: "18px" }}>Zipcode<input type="number" name="zipCode" placeholder="zipcode" className="dd_mm"  onChange={onChange}/></label>

              </div>
              <br />
              
              <div className="city">
                <label style={{ fontSize: "20px", display: "grid", fontWeight: "500" }}>State<br />
                  <select className="state_city" onChange={stateSelected}><option value="">Select a State</option> {states.map(stateItem => (
                    <option key={stateItem.isoCode} id={stateItem.isoCode} value={`${stateItem.isoCode}-${stateItem.name}`}>{stateItem.name}</option>
                  ))}
                  </select>
                </label><br />
                <label style={{ fontSize: "20px", fontWeight: "500" }}>City<br />
                  <select className="state_city" name="city" onChange={(e) => { setCity(e.target.value?e.target.value:"") }}>{cities ?
                    <option value="">Select a City</option>
                    : null} {cities.map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </label><br /><br />

              </div>
              <span>
                <a className="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Penal Code ⮟
                </a>

              </span>
              <div className="collapse" id="collapseExample">
                <div className="card card-body">
                  <input type="text" name="penalCode" onChange={onChange} placeholder="Penal Code.." style={{ textDecoration: "none", border: "2px solid blue", padding: "5px", fontSize: "1rem", borderRadius: "2px" }} />
                  121, 141, 144, 146, 147, 148, 151, 153-A, 295-A, 268, 302, 304-B, 307, 322, 324, 351, 354, 509, 498-A, 363, 364, 365, 366, 376, 379, 380, 383, 390, 391, 392,395, 396, 397,411, 420, 441, 442, 447,448,454, 457, 465, 467,468,470,471, 489-A, 504,506
                </div>
              </div>

            </form>
          </span>
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <span>
            <h2 className="spanning">TimeLine<hr /></h2>
            <div className="Table">
              <table className="table table-striped">

                <tbody className="table-group-divider">
                  {
                    firsDisplayed.map((fir)=>{return <tr key={fir._id}>
                      <td style={{ width: '75px' }}>{fir.timestamp.split('T')[0]}<br />{fir.timestamp.split('T')[1].split('.')[0]}</td>
                      <td style={{ width: '200px' }}>{fir.type}<br />{fir.highlight}<br />{fir.crimeCity+", "+fir.crimeState}</td>
                    </tr>})
                    

                  }


                </tbody>
              </table>
            </div>
          </span>


        </div>
      </div>
    </div>
  );
}

export default Tabmap;