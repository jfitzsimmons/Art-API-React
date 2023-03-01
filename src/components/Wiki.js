import React, { useCallback, useState, useEffect } from 'react'
//import { usePrevious } from '../utils/helpers'

//import * as ReactDOM from 'react-dom'
//import Map from './Map'

export default function Wiki(props) {
  const { cityName, coords, setcitygeoi } = props
  //const prevLat = usePrevious(coords[0].lat)
  const [page, setPage] = useState(0)
  const [coordsI, setCitiesI] = useState(0)
  const [wikiResults, setWikiResults] = useState([])
  //const [returnError, setReturnError] = useState(false)
  //testjpf move to painting as well as coords state

  const getWikiData = useCallback(async () => {
    try {
      console.log('coords[coordsI]')
      console.log(coords[coordsI])
      //testjpf see if you can get coordinates
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=coordinates|extracts&exchars=530&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=${coords[coordsI].lat}|${coords[coordsI].lon}&formatversion=2&format=json`
      )
      const data = await res.json()

      // console.log('NESTED')
      // console.dir(data)
      //testjpf should move onto the next city coordinate if no query results
      //${coords[1].lat}|${coords[1].lon}
      //await data.query
      //testjpf the idea is...
      //if the length of query.pages is low , 0 or 1

      //const sorted = data.query.pages.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

      if (await data.query) {
        console.log('data.query.page')
        console.log(data.query.pages)
        if (data.query.pages.length < 1 || !data.query.pages) {
          console.log(' setCitiesI(coordsI + 1)', coordsI + 1)
          setCitiesI(coordsI + 1)
        } else {
          console.log(
            ' setWikiResults(data.query.pages)',
            data.query.pages.length
          )
          setWikiResults(data.query.pages)
        }
      } else {
        setCitiesI(coordsI + 1)
      }
    } catch (error) {
      console.log(`Something went wrong: ${error}`)
      return null
    }
  }, [coords, coordsI])

  useEffect(() => {
    if (coords) {
      console.log('WIKI ::: useEffect? - coords')

      getWikiData()
    }
  }, [getWikiData, coords, coordsI])

  useEffect(() => {
    if (cityName) {
      console.log(
        'WIKI ::: reset page to 0 on city change? - cityName',
        cityName
      )

      setPage(0)
    }
  }, [cityName])

  useEffect(() => {
    console.log('wikiResults')
    console.log(wikiResults)
    if (page > -1 && wikiResults && wikiResults.length > 0) {
      console.log('WIKI - page', page)
      //console.log(wikiResults)
      //testjpf, probably not needed.  somehow need to send wikiresult.page back to painting!!!
      setcitygeoi(wikiResults[page].coordinates[0])
    }
  }, [page, setcitygeoi, wikiResults])

  return (
    <div className="wiki">
      {wikiResults && wikiResults[page] ? (
        <div>
          <div className="wiki__results">
            <span className="label__title row">
              Wikipedia results for articles from the regions around around{' '}
              {coords[coordsI].display_name}:
            </span>
            <span className="label__title row">{wikiResults[page].title}</span>
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
      ) : (
        <div className="wiki">
          <div>
            <svg className="loading" viewBox="25 25 50 50">
              <circle cx="50" cy="50" r="20"></circle>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
