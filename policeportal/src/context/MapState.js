import React,{ useState,useEffect } from "react";
import MapContext from "./mapContext";

// Used to implement conditional rendering of components...
// Will contain a user state variable, which will be populated by the user's info like permissions

const UserState = (props) => 
{
    
    const [firsDisplayed, setFirsDisplayed] = useState([])
    const [filters, setFilters] = useState({})
    const [firSelected,setFirSelected ] = useState()


  return (
    
      <>
      <MapContext.Provider value={ { firsDisplayed,setFirsDisplayed, filters, setFilters,firSelected,setFirSelected} }>
        {props.children}
      </MapContext.Provider>
      </>
  )
}

export default UserState
