import React, { memo, createRef, useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'
import { usePrevious } from '../utils/helpers'

const markerRefs = []

export default React.memo(function Map(props) {
  const { coords, wikiMapCenter, wikicoords, setGeoResultsI, paintingPage } =
    props
  const [page, setPage] = useState(0)
  const [mapCenter, setMapCenter] = useState({})
  const prevPage = usePrevious(page)
  const prevPaintingPage = usePrevious(paintingPage)

  const renderItems = (coords, icon) => {
    return (
      coords &&
      coords.map((place) => (
        <Post
          iconClass={`map_icon__${icon}`}
          key={place.place_id}
          place={place}
        />
      ))
    )
  }

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
    if (wikiMapCenter && wikiMapCenter.lat) {
      setMapCenter(wikiMapCenter)
    }
  }, [wikiMapCenter])

  useEffect(() => {
    if (prevPaintingPage !== paintingPage) {
      setPage(0)
    }
  }, [paintingPage, prevPaintingPage])

  useEffect(() => {
    if (page > -1 && prevPage !== page) {
      setGeoResultsI(page)
    }
  }, [page, prevPage, setGeoResultsI])

  return (
    <>
      {coords && coords.length > 0 && wikicoords && wikicoords.length > 0 ? (
        <div className="map__container">
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

            {
              coords &&
                coords.length > 0 &&
                renderItems(
                  coords,
                  'painting'
                ) /** coordinates from geo search */
            }
            {
              wikicoords &&
                wikicoords.length > 0 &&
                renderItems(
                  wikicoords,
                  'wiki'
                ) /** coordinates from wiki articles */
            }
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
})
