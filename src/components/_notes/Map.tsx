import React, { memo, createRef, useEffect } from 'react'
//import GoogleMapReact from 'google-map-react'
//import { MapMarker } from './MapMarker'
import L, { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
//import './App.scss';

//const MAP_API_KEY = `${process.env.REACT_APP_MAP_API_KEY}`
const markerRefs: React.RefObject<L.Marker>[] = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Map(props: { cities: any }) {
  // const [zoom, setZoom] = useState(10)
  const { cities } = props
  const defaultPosition: LatLngExpression = [38.65727, -90.29789]
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
  */
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

  const renderItems = () => {
    return (
      cities &&
      cities.map((place: Place) => <Post key={place.place_id} place={place} />)
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Post = memo(({ place }: any) => {
    const newRef = createRef<L.Marker>()
    markerRefs.push(newRef)
    return (
      <Marker
        key={place.id}
        position={[place.latitude, place.longitude]}
        //eventHandlers={{ click: () => showPreview(place) }}
        icon={L.divIcon({
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, 0],
          shadowSize: [0, 0],
          className: `map-icon map-icon_${place.place_id}`,
        })}
        ref={newRef as React.RefObject<L.Marker>}
      >
        <Tooltip>{place.label}</Tooltip>
      </Marker>
    )
  })

  useEffect(() => {
    //function HelloWorld() { return "Hello, World!"; }
    // ReactDOM.render(React.createElement(HelloWorld), document.getElementById("root"));
  }, [])

  return (
    <div className="map__container">
      <MapContainer
        center={defaultPosition}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100vh' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/jfitzsimmons/ckvntg80w0gn014qc1s75efwr/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamZpdHpzaW1tb25zIiwiYSI6ImNrdm50am1vcDNnMGEybnFmZHpzYzJodWEifQ.Y-mgO21RLeOtil5V_Fu7dA"
        />

        {/**cities && cities.length > 0 && renderItems()**/}
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
