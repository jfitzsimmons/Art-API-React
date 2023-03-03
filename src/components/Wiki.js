import React, { useCallback, useState, useEffect } from 'react'
import { usePrevious } from '../utils/helpers'

export default React.memo(function Wiki(props) {
  const { cityName, coords, setWikiPageCoords, setwikicoords, coordsI } = props
  const [page, setPage] = useState(0)
  const [returnError, setReturnError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [wikiResults, setWikiResults] = useState([])
  const prevPage = usePrevious(page)
  const prevCoordsI = usePrevious(coordsI)
  const prevCityName = usePrevious(cityName)

  //const [returnError, setReturnError] = useState(false)

  const getWikiData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=coordinates|extracts&exchars=530&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=${coords[coordsI].lat}|${coords[coordsI].lon}&formatversion=2&format=json`
      )
      const data = await res.json()

      if ((await data.query) && data.query.pages.length > 1) {
        console.log(`All good`)
        const cloned = data.query.pages.map(
          ({ title, pageid, coordinates }) => ({
            display_name: title,
            place_id: pageid,
            lat: coordinates[0].lat,
            lon: coordinates[0].lon,
          })
        )

        setWikiResults(data.query.pages)
        setwikicoords(cloned)
      } else {
        console.log(`setWikiResults([])`)
        setWikiResults([])
      }
    } catch (error) {
      console.log(`Something went wrong: ${error}`)
      setReturnError(true)
    } finally {
      setIsLoading(false)
    }
  }, [coords, coordsI, setwikicoords])

  useEffect(() => {
    if (coords && coords.length > 0) {
      console.log('UUU ||| wiki ::: getWiki articles')

      getWikiData()
    }
  }, [getWikiData, coords])

  useEffect(() => {
    if (
      cityName &&
      page !== 0 &&
      prevPage !== page &&
      prevCityName !== cityName
    ) {
      console.log('UUU ||| wiki ::: city change, set page to 0')
      setPage(0)
    }
  }, [cityName, page, prevCityName, prevPage])

  useEffect(() => {
    if (page > -1 && wikiResults && wikiResults.length > 0) {
      console.log('UUU ||| wiki ::: setWikiPageCoords?????????')
      setWikiPageCoords(wikiResults[page].coordinates[0])
    }
  }, [page, setWikiPageCoords, wikiResults])

  return (
    <div className="wiki">
      {wikiResults && wikiResults.length > 0 && isLoading === false ? (
        <div>
          {console.log('RRR ||| WIKI RETURNwikiResults EXIST')}

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
        </div>
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
                {coords[coordsI].display_name} did not return any results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
})
