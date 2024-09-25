import React, { useState, useRef, useMemo, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import marker from '../../location-sign-svgrepo-com.svg'
const DraggbleMarker = (props) => {
      
      
      const [position, setPosition] = useState(props.latlong)

      const markerRef = useRef(null)
      const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current
            if (marker != null) {
              setPosition(marker.getLatLng()) 
              props.setLatLong(marker.getLatLng())
            }
          },
        }),
        [],
      )
    
      return (
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
          icon={new L.Icon({
            iconUrl: marker,
            iconSize: [40,40]
          }
            
            )
          }>
          
        </Marker>
      )
}

export default DraggbleMarker
