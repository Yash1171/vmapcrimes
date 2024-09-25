import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import "./location.scss"

function Location() {
  return (
    <div className='location'>
        <Sidebar/>
        <div className="locationcontainer">
            <Navbar/>
            <div className="map">
            <div class="_map">
              <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1rj3ODC1KZDjqp-MFS0ibG66y8_MOx8g&ehbc=2E312F" title='navgation' width="940" height="480"></iframe>
            </div>
            </div>
        </div>
      
    </div>
  )
}

export default Location

