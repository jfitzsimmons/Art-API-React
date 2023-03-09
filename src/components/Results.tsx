import React, { useState, useEffect, useCallback } from 'react'
import Wiki from './Wiki'
import Map from './Map'
import Painting from './Painting'
import {
  usePrevious,
  placeNameForReverseGeo,
  setStyle,
  makeid,
  countryLookup,
} from '../utils/helpers'
import { IPainting, ICoordinate, ICoordData } from '../utils/types'
import './Painting.scss'
import RandomIcon from '../assets/svg/random.svg'

// testjpf make it so if you click on marker
// it takes you to that "page" in pagination for wiki result

export default React.memo(
  (props: {
    paintings: IPainting[]
    resultsId: string
    randomSearch: (hash: string) => void
  }) => {
    const { paintings, resultsId, randomSearch } = props
    const prevResultsId = usePrevious(resultsId)
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(0)
    const prevPage = usePrevious(page)
    const [returnError, setReturnError] = useState(false)
    const [cityName, setCityName] = useState()
    const prevCityName = usePrevious(cityName)
    const [mapCenter, setMapCenter] = useState<ICoordinate>({})
    const [geoResultCoords, setGeoResultCoords] = useState([])
    const [wikiCoords, setWikiCoords] = useState<ICoordData[]>([])
    const [geoResultsI, setGeoResultsI] = useState(0)

    const getGeosNearPlaceName = useCallback(async () => {
      if (!cityName) return null
      let city: string = countryLookup[cityName]
        ? countryLookup[cityName]
        : cityName
      city = city
        .replace(/-.*, /, ' ')
        .replace('(', ' ')
        .replace('probably', '')
        .replace(',', ' ')

      fetch(`https://geocode.maps.co/search?q=${city.split('/')[0]}`, {
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

    function loadPainting(p: IPainting) {
      setIsLoading(true)
      setStyle(p.colors)
      setCityName(placeNameForReverseGeo(p))
    }

    useEffect(() => {
      if (page && page >= 0 && prevPage !== page && paintings[page]) {
        loadPainting(paintings[page])
        // page through current painitngs
      } else if (
        page >= 0 &&
        prevResultsId !== resultsId &&
        paintings.length > 0
      ) {
        // new paintings from search
        loadPainting(paintings[0])
        setPage(0)
      }
    }, [page, paintings, prevPage, prevResultsId, resultsId])

    useEffect(() => {
      if (cityName && prevCityName !== cityName) {
        // get coordinates around painting location
        getGeosNearPlaceName()
        // clean up conditional testjpf???
      } else if (
        (cityName &&
          prevCityName === cityName &&
          prevResultsId !== resultsId) ||
        (cityName && prevResultsId === resultsId && isLoading === true)
      ) {
        setIsLoading(false)
      }
    }, [
      cityName,
      getGeosNearPlaceName,
      isLoading,
      prevCityName,
      prevResultsId,
      resultsId,
    ])

    // Testjpf abstract error component
    return (
      <main className="main">
        {paintings && paintings.length > 0 && isLoading === false ? (
          <>
            {paintings[page] && geoResultCoords && (
              <Painting
                paintings={paintings}
                cityName={cityName}
                page={page}
                setPage={setPage}
              />
            )}
            <div className="map-wiki flx-ctr wrap">
              {geoResultCoords && geoResultCoords.length > 0 && cityName && (
                <Wiki
                  setWikiCoords={setWikiCoords}
                  setMapCenter={setMapCenter}
                  cityName={cityName}
                  coords={geoResultCoords}
                  geoResultsI={geoResultsI}
                />
              )}
              <div className="map">
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
                <svg
                  className="loading"
                  viewBox="25 25 50 50"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </div>
            ) : (
              <div className="no_results">
                <p>These tags did not return any results</p>
                <button
                  type="button"
                  onClick={() => randomSearch(makeid(6))}
                >
                  random
                  <br />
                  <img
                    src={RandomIcon}
                    alt="random search term icon"
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    )
  },
)
