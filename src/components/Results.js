import React, { useState, useEffect, useCallback } from 'react'
import Wiki from './Wiki'
import Map from './Map'
import Painting from './Painting'
import { usePrevious, countryLookup } from '../utils/helpers'
import './Painting.scss'

const setStyle = (colors) => {
  let gradient = ''
  for (let i = colors.length; i--; ) {
    gradient += colors[i].color
    gradient += i === 0 ? ')' : ', '
  }
  document.body.style.background = `radial-gradient(circle at bottom right, ${gradient}`
}

const placeNameForReverseGeo = (p) => {
  let birthplace =
    p.people && p.people.length > 0 ? p.people[0].birthplace : null
  if (birthplace) {
    birthplace =
      birthplace.length > 23 ? birthplace.split(' ').pop() : birthplace
  } else {
    if (p.culture) {
      birthplace = countryLookup[p.culture]
        ? countryLookup[p.culture]
        : p.culture.split(' ').shift()
    } else if (p.period) {
      birthplace = p.period.split(' ').shift()
      console.log('paint PERIOD birthplace', birthplace)
    } else if (p.division) {
      birthplace =
        p.division.length > 23 ? p.division.split(' ').shift() : p.division
    }
  }

  if (!birthplace) console.log(p)
  console.log('PAINTING placeNameForReverseGeo', birthplace)
  return birthplace
}

//testjpf make it so if you click on marker it takes you to that "page" in pagination for wiki result

export default React.memo(function Results(props) {
  const { paintings } = props
  const prevRecordsId = usePrevious(paintings[0].id)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const prevPage = usePrevious(page)
  const [returnError, setReturnError] = useState(false)
  const [cityName, setCityName] = useState('')
  const prevCityName = usePrevious(cityName)
  const [mapCenter, setMapCenter] = useState({})
  const [geoResultCoords, setGeoResultCoords] = useState({})
  const [wikiCoords, setWikiCoords] = useState([])
  const [geoResultsI, setGeoResultsI] = useState(0)

  const getGeosNearPlaceName = useCallback(async () => {
    fetch(`https://geocode.maps.co/search?q=${cityName}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseData) => {
        setGeoResultCoords(responseData)
      })
      .catch((error) => {
        setReturnError(true)
        console.log(error)
      })
  }, [cityName])

  useEffect(() => {
    if (page && page >= 0 && prevPage !== page && paintings[page]) {
      //page through current painitngs
      setIsLoading(true)
      setStyle(paintings[page].colors)
      setCityName(placeNameForReverseGeo(paintings[page]))
    } else if (page >= 0 && prevRecordsId !== paintings[0].id) {
      //new paintings from search
      setIsLoading(true)
      setStyle(paintings[0].colors)
      setCityName(placeNameForReverseGeo(paintings[0]))
      setPage(0)
    }
  }, [page, paintings, prevPage, prevRecordsId])

  useEffect(() => {
    if (cityName && cityName !== '' && prevCityName !== cityName) {
      //get coordinates around painting location
      getGeosNearPlaceName()
    } else if (cityName && cityName !== '' && prevCityName === cityName) {
      setIsLoading(false)
    }
  }, [cityName, getGeosNearPlaceName, prevCityName])

  //Testjpf abstract error component
  return (
    <main className="main">
      {paintings && paintings.length > 0 && isLoading === false ? (
        <>
          {paintings[page] &&
            geoResultCoords &&
            geoResultCoords.length > 0 &&
            cityName !== '' && (
              <div>
                <Painting
                  paintings={paintings}
                  cityName={cityName}
                  page={page}
                  setPage={setPage}
                />
              </div>
            )}
          <div className="map-wiki flx-ctr wrap">
            {paintings[page] &&
              geoResultCoords &&
              geoResultCoords.length > 0 &&
              cityName !== '' && (
                <Wiki
                  setWikiCoords={setWikiCoords}
                  setMapCenter={setMapCenter}
                  cityName={cityName}
                  coords={geoResultCoords}
                  geoResultsI={geoResultsI}
                />
              )}
            <div className="map">
              {/** 
            Wrong "america"??? next / prev | change wikiresults{' '}
            <p>Locations found for {cityName}:</p>*/}
              {page > -1 &&
                ((wikiCoords && wikiCoords.length > 0) ||
                  (geoResultCoords && geoResultCoords.length > 0)) && (
                  <Map
                    wikicoords={wikiCoords}
                    wikiMapCenter={mapCenter}
                    coords={geoResultCoords}
                    setGeoResultsI={setGeoResultsI}
                    paintingPage={page}
                  />
                )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="render-coontainer">
            {returnError && (
              <div className="search-error">ERROR: something went wrong</div>
            )}
            {isLoading ? (
              <div className="painting flx-ctr">
                <div>
                  <svg className="loading" viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20"></circle>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="no-results">
                These tags did not return any results
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
})
