import React, { memo, createRef, useEffect } from 'react'
//import GoogleMapReact from 'google-map-react'
import L, { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'
//import './App.scss';

//const MAP_API_KEY = `${process.env.REACT_APP_MAP_API_KEY}`
const markerRefs = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Map(props) {
  // const [zoom, setZoom] = useState(10)
  const { coords, cityGeoI } = props
  const defaultPosition = [38.65727, -90.29789]
  /** 
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: this.props.lat,
        lng: this.props.lng
      }
    }
    this.zoom = 10;
  }

  componentDidUpdate(prevProps) {
    if (this.props.lat !== prevProps.lat) {
      this.setState({
       center: {
         lat: this.props.lat,
         lng: this.props.lng
       }
      })
    }
  }

  interface Place {
    place_id: number
    lat: number
    lon: number
    timestamp: string
    label: string
    distance?: number
    mph?: number
    timing?: number
  }
  */
  const renderItems = () => {
    return (
      coords &&
      coords.map((place) => <Post key={place.place_id} place={place} />)
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Post = memo(({ place }) => {
    const newRef = createRef()
    markerRefs.push(newRef)
    return (
      <Marker
        key={place.id}
        position={[place.lat, place.lon]}
        //eventHandlers={{ click: () => showPreview(place) }}
        icon={L.divIcon({
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, 0],
          shadowSize: [0, 0],
          className: `map-icon`,
        })}
        ref={newRef}
      >
        <Tooltip>{place.displa_name}</Tooltip>
      </Marker>
    )
  })

  const RecenterAutomatically = ({ lat, lon }) => {
    const map = useMap()
    useEffect(() => {
      map.setView([lat, lon])
    }, [lat, lon])
    return null
  }

  useEffect(() => {
    if (cityGeoI) {
      console.log('MAP :::   cityGeoI', cityGeoI.lat)

      //  setPage(0)
    }
  }, [cityGeoI])

  return (
    <div className="map__container">
      <MapContainer
        center={[coords[0].lat, coords[0].lon]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: '512px', width: '100%' }}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coords && coords.length > 0 && renderItems()}

        {
          //testjpf works but needs markers
          //copy renderItems() above and do the same for all citygeos
          //this meeans I need all of wikiresults, (or at least filter out the coordinates for the markers) !!!

          cityGeoI.lat && (
            <RecenterAutomatically lat={cityGeoI.lat} lon={cityGeoI.lon} />
          )
        }
      </MapContainer>
    </div>
  )
  /** 
  render() {
    if (this.state.center) {
      return (
        <div className="map-container">
          <GoogleMapReact
            bootstrapURLKeys={{ key: MAP_API_KEY }}
            center={this.state.center}
            zoom={this.zoom}
          >
            <MapMarker
              lat={this.state.center.lat}
              lng={this.state.center.lng}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>

      );
    } else {
      return (
        <div></div>
      );
    }
  } **/
}
