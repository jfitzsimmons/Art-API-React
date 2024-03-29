import React, { useCallback, useState, useEffect, useRef } from 'react'
import { usePrevious } from '../utils/helpers'
import { ICoordData, ICoordinate, IWikiResult } from '../utils/types'

export default React.memo(
  (props: {
    setWikiCoords: (a: ICoordData[]) => void
    setMapCenter: (c: ICoordinate) => void
    cityName: string
    geoResultsI: number
    coords: ICoordData[]
  }) => {
    const { cityName, coords, setMapCenter, setWikiCoords, geoResultsI } = props
    const [page, setPage] = useState(0)
    const [returnError, setReturnError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [wikiResults, setWikiResults] = useState<IWikiResult[]>([])
    const prevPage = usePrevious(page)
    const prevCityName = usePrevious(cityName)
    const prevGeoResultsI = usePrevious(geoResultsI)
    const mountedRef = useRef(true)

    // const [returnError, setReturnError] = useState(false)

    const getWikiData = useCallback(async () => {
      try {
        setIsLoading(true)
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=coordinates|extracts&exchars=530&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=${coords[geoResultsI].lat}|${coords[geoResultsI].lon}&formatversion=2&format=json`,
        )
        const data = await res.json()

        if ((await data.query) && data.query.pages.length > 1) {
          const cloned: ICoordData[] = data.query.pages.map(
            ({ title, pageid, coordinates }: any) => ({
              display_name: title,
              place_id: pageid,
              lat: coordinates[0].lat,
              lon: coordinates[0].lon,
            }),
          )
          if (!mountedRef.current) return null

          setWikiResults(data.query.pages)
          setWikiCoords(cloned) // for map
        } else {
          setWikiResults([])
        }
      } catch (error) {
        console.log(`Something went wrong: ${error}`)
        setReturnError(true)
      } finally {
        setIsLoading(false)
      }
      return null
    }, [coords, geoResultsI, setWikiCoords])

    useEffect(() => {
      if (coords && coords.length > 0) {
        mountedRef.current = true
        getWikiData()
      }
      return () => {
        mountedRef.current = false
      }
    }, [getWikiData, coords])

    useEffect(() => {
      if (
        (cityName &&
          page !== 0 &&
          prevPage !== page &&
          prevCityName !== cityName) ||
        (prevGeoResultsI !== undefined && prevGeoResultsI !== geoResultsI)
      ) {
        setPage(0) // reset on painting change
      }
    }, [cityName, geoResultsI, page, prevCityName, prevGeoResultsI, prevPage])

    useEffect(() => {
      if (page > -1 && wikiResults && wikiResults.length > 0) {
        setMapCenter(wikiResults[page].coordinates[0])
        setIsLoading(false)
      }

      return () => {
        mountedRef.current = false
      }
    }, [page, setMapCenter, wikiResults])

    return (
      <div className="wiki">
        {wikiResults && wikiResults.length > 0 && isLoading === false ? (
          <div>
            <div className="wiki__results">
              <div className="label__title row">
                <p>
                  <span className="green">{cityName}</span> addresses from
                  OpenStreetMaps{' '}
                </p>
                <p>
                  Address #{geoResultsI + 1}:{' '}
                  <span className="blue">
                    {coords[geoResultsI].display_name}
                  </span>
                </p>
              </div>
              <span className="label__title row">
                <span className="red">Wikipedia</span> articles found around{' '}
                <span className="blue">address #{geoResultsI + 1}</span>
                <br /> Article #{page + 1}
                {': '}
                <span className="red">{wikiResults[page].title}</span>
              </span>
              <div className="page">
                {page + 1} of {wikiResults.length}
                <br />
                <button
                  type="button"
                  className="prev"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  previous
                </button>{' '}
                |{' '}
                <button
                  type="button"
                  className="next"
                  onClick={() => setPage(page + 1)}
                  disabled={page === wikiResults.length - 1}
                >
                  next
                </button>
              </div>
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
                </div>
              ) : (
                <div className="no-results">
                  {cityName} did not return any results
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  },
)
