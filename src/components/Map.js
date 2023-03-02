import React, { memo, createRef, useEffect, useState } from 'react'
//import GoogleMapReact from 'google-map-react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'
import { usePrevious } from '../utils/helpers'

//import './App.scss';

//const MAP_API_KEY = `${process.env.REACT_APP_MAP_API_KEY}`
const markerRefs = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Map(props) {
  const { coords, cityGeoI, wikicoords, setPaintingCoords, paintingPage } =
    props
  // const [zoom, setZoom] = useState(10)
  const [page, setPage] = useState(0)
  const [mapCenter, setMapCenter] = useState({})
  const prevPage = usePrevious(page)
  const prevPaintingPage = usePrevious(paintingPage)

  //const defaultPosition = [38.65727, -90.29789]
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
  const renderItems = (coords, icon) => {
    return (
      coords &&
      coords.map(
        (place) => (
          <Post
            iconClass={`map_icon__${icon}`}
            key={place.place_id}
            place={place}
          />
        )

        // wikicoords &&
        //wikicoords.map((place) => <Post key={place.place_id} place={place} />
      )
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Post = memo(({ place, iconClass }) => {
    const newRef = createRef()
    markerRefs.push(newRef)
    return (
      <Marker
        key={place.place_id}
        position={[place.lat, place.lon]}
        //eventHandlers={{ click: () => showPreview(place) }}
        icon={L.divIcon({
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, 0],
          shadowSize: [0, 0],
          className: `map_icon ${iconClass}`,
        })}
        ref={newRef}
      >
        <Tooltip>{place.display_name}</Tooltip>
      </Marker>
    )
  })

  const RecenterAutomatically = ({ lat, lon }) => {
    const map = useMap()
    useEffect(() => {
      map.setView([lat, lon])
    }, [lat, lon, map])
    return null
  }

  useEffect(() => {
    if (cityGeoI && cityGeoI.lat) {
      //testjpf  rename cityGeoI
      setMapCenter(cityGeoI)
      console.log('UUU ||| map ::: setMapCenter(cityGeoI)')
      //console.log(cityGeoI)
    }
  }, [cityGeoI])
  useEffect(() => {
    if (prevPaintingPage !== paintingPage) {
      setPage(0)
      console.log('UUU ||| map ::: restet page t 0 on patnng change')
    }
  }, [paintingPage, prevPaintingPage])
  useEffect(() => {
    if (page > -1 && prevPage !== page) {
      //testjpf  rename cityGeoI
      console.log('UUU ||| map ::: other painint coords')

      setPaintingCoords(page)
    }
  }, [page, prevPage, setPaintingCoords])

  return (
    <>
      {coords && coords.length > 0 && wikicoords && wikicoords.length > 0 ? (
        <div className="map__container">
          {/**console.log('RRR ||| MAP RETURN')**/}

          <MapContainer
            center={[coords[0].lat, coords[0].lon]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '100%', minHeight: '100%', width: '100%' }}
          >
            <TileLayer
              attribution=' Map data <br /> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>,<br /> <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,<br />  Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {coords && coords.length > 0 && renderItems(coords, 'painting')}
            {wikicoords &&
              wikicoords.length > 0 &&
              renderItems(wikicoords, 'wiki')}
            {mapCenter.lat && (
              <RecenterAutomatically lat={mapCenter.lat} lon={mapCenter.lon} />
            )}
          </MapContainer>
          <div className="map__paging_wrap">
            <div className="map__paging page">
              {page + 1} of {coords.length}
              <br />
              <button
                className="prev"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                previous
              </button>{' '}
              |{' '}
              <button
                className="next"
                onClick={() => setPage(page + 1)}
                disabled={page === coords.length - 1}
              >
                next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}