import React, { useCallback, useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { Map } from './Map'

export default function Wiki(props) {
  const { city } = props
  const [page, setPage] = useState(0)
  const [cities, setCities] = useState({})
  const [wikiResults, setWikiResults] = useState({})
  const [returnError, setReturnError] = useState(false)

  const getCityGeocode = useCallback(async () => {
    console.log('getCityGeocode city', city)

    fetch(`https://geocode.maps.co/search?q=${city}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseData) => {
        setCities(responseData)
      })
      .catch((error) => {
        setReturnError(true)
        console.log(error)
      })
  }, [city])

  const getWikiData = useCallback(async () => {
    let data = null
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&exchars=530&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=${cities[0].lat}|${cities[0].lon}&formatversion=2&format=json`
      )
      const data = await res.json()

      console.log('NESTED')
      console.dir(data)
      //testjpf should move onto the next city coordinate if no query results
      //${cities[1].lat}|${cities[1].lon}
      ;(await data.query)
        ? setWikiResults(data.query.pages)
        : setWikiResults({})
    } catch (error) {
      console.log(`Something went wrong: ${error}`)
      return null
    }
  }, [cities])

  useEffect(() => {
    if (cities) {
      getWikiData()
    }
  }, [getWikiData, cities])

  useEffect(() => {
    city && city !== '' && getCityGeocode()
  }, [city, getCityGeocode])

  return (
    <div>
      {wikiResults && wikiResults[page] ? (
        <div className="map-wiki flx-ctr wrap">
          <div className="wiki">
            <div className="wiki__results">
              <span className="label__title row">
                Wikipedia results for {city}:
              </span>
              <span className="label__title row">
                {wikiResults[page].title}
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: wikiResults[page].extract }}
              />

              <br />
              <a
                className="wiki__link row"
                href={`https://en.wikipedia.org/?curid=${wikiResults[page].pageid}`}
              >
                {wikiResults[page].title} on wikipedia
              </a>
            </div>
            <div className="page">
              {page + 1} of {wikiResults.length}
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
                disabled={page === wikiResults.length - 1}
              >
                next
              </button>
            </div>
          </div>
          <div className="map">
            Wrong "america"??? next / prev | change wikiresults{' '}
            <p>Locations found for {city}:</p>
          </div>
        </div>
      ) : (
        <div className="map-wiki flx-ctr wrap">
          <div className="wiki">
            <div>
              <svg className="loading" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"></circle>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
