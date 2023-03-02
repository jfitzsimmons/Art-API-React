import React, { useCallback, useState, useEffect } from 'react'

export default function Wiki(props) {
  const { cityName, coords, setcitygeoi, setwikicoords, coordsI } = props
  const [page, setPage] = useState(0)
  const [wikiResults, setWikiResults] = useState([])
  //const [returnError, setReturnError] = useState(false)

  const getWikiData = useCallback(async () => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=coordinates|extracts&exchars=530&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=${coords[coordsI].lat}|${coords[coordsI].lon}&formatversion=2&format=json`
      )
      const data = await res.json()

      if (await data.query) {
        if (data.query.pages.length < 1 || !data.query.pages) {
          //setCitiesI(coordsI + 1)
        } else {
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
        }
      } else {
        // setCitiesI(coordsI + 1)
      }
    } catch (error) {
      console.log(`Something went wrong: ${error}`)
      return null
    }
  }, [coords, coordsI, setwikicoords])

  useEffect(() => {
    if (coords) {
      getWikiData()
    }
  }, [getWikiData, coords, coordsI])

  useEffect(() => {
    if (cityName) {
      setPage(0)
    }
  }, [cityName, coordsI])

  useEffect(() => {
    if (page > -1 && wikiResults && wikiResults.length > 0) {
      setcitygeoi(wikiResults[page].coordinates[0])
    }
  }, [page, setcitygeoi, wikiResults])

  return (
    <div className="wiki">
      {wikiResults && wikiResults[page] ? (
        <div>
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
