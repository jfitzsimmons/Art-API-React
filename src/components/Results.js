import React, { useState, useEffect, useCallback } from 'react'
import Wiki from './Wiki'
import Map from './Map'
import Painting from './Painting'
import { usePrevious, placeNameForReverseGeo, setStyle } from '../utils/helpers'
import './Painting.scss'

//testjpf make it so if you click on marker it takes you to that "page" in pagination for wiki result

export default React.memo(function Results(props) {
  const { paintings, resultsId } = props
  const prevRecordsId = usePrevious(paintings[0].id)
  const prevResultsId = usePrevious(resultsId)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const prevPage = usePrevious(page)
  const [returnError, setReturnError] = useState(false)
  const [cityName, setCityName] = useState()
  const prevCityName = usePrevious(cityName)
  const [mapCenter, setMapCenter] = useState({})
  const [geoResultCoords, setGeoResultCoords] = useState([])
  const [wikiCoords, setWikiCoords] = useState([])
  const [geoResultsI, setGeoResultsI] = useState(0)

  const getGeosNearPlaceName = useCallback(async () => {
    fetch(
      `https://geocode.maps.co/search?q=${
        cityName
          .replace(/-.*, /, ' ')
          .replace('(', ' ')
          .replace('probably', '')
          .replace(',', ' ')
          .split('/')[0]
      }`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setGeoResultCoords(responseData)
      })
      .catch((error) => {
        setReturnError(true)
        console.log(error)
      })
  }, [cityName])

  function loadPainting(p) {
    setIsLoading(true)
    setStyle(p.colors)
    setCityName(placeNameForReverseGeo(p))
  }

  useEffect(() => {
    if (page && page >= 0 && prevPage !== page && paintings[page]) {
      loadPainting(paintings[page])
      //page through current painitngs
    } else if (page >= 0 && prevRecordsId !== paintings[0].id) {
      //new paintings from search
      loadPainting(paintings[0])
      setPage(0)
    }
  }, [page, paintings, prevPage, prevRecordsId])

  useEffect(() => {
    if (cityName && prevCityName !== cityName) {
      //get coordinates around painting location
      getGeosNearPlaceName()
      //clean up conditional testjpf???
    } else if (
      (cityName && prevCityName === cityName && prevResultsId !== resultsId) ||
      (cityName && prevResultsId === resultsId && isLoading === true)
    ) {
      setIsLoading(false)
    }
  }, [cityName, getGeosNearPlaceName, isLoading, prevCityName, prevResultsId, resultsId])

  //Testjpf abstract error component
  return (
    <main className="main">
      {paintings && paintings.length > 0 && isLoading === false ? (
        <>
          <div className="painting__frame flx-ctr">
            {paintings[page] && geoResultCoords && (
              <Painting
                paintings={paintings}
                cityName={cityName}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
          <div className="map-wiki flx-ctr wrap">
            {paintings[page] &&
              geoResultCoords &&
              geoResultCoords.length > 0 &&
              cityName && (
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
                mapCenter &&
                mapCenter.lat &&
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
        <div className="painting__frame flx-ctr">
          {returnError && (
            <div className="search-error">ERROR: something went wrong</div>
          )}
          {isLoading ? (
            <div className="painting flx-ctr fadein">
              <svg className="loading" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"></circle>
              </svg>
            </div>
          ) : (
            <div className="no-results">
              These tags did not return any results
            </div>
          )}
        </div>
      )}
    </main>
  )
})
