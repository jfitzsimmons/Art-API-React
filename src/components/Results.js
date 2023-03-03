import React, { useState, useEffect, useCallback } from 'react'
import Wiki from './Wiki'
import Map from './Map'
import Painting from './Painting'
import { usePrevious } from '../utils/helpers'
import './Painting.scss'

const countryLookup = {
  Italian: 'italy',
  French: 'france',
  American: 'america',
  Indian: 'india',
  India: 'india',
  Chinese: 'china',
  Japanese: 'japan',
  Dutch: 'netherlands',
  German: 'germany',
  Korean: 'korea',
  Persian: 'persia',
  British: 'britain',
  Netherlandish: 'netherlands',
  Russian: 'russia',
}

//testjpf painting ID is used to get object that has places
//use place id to get lat long.  use lat long to get wikipeida search results
// update map with  marker for paint place and wikipedia results?
//make it so if you click on marker it takes you to that "page" in pagination for wiki result

export default React.memo(function Results(props) {
  const { paintings } = props
  const [page, setPage] = useState(0)
  const [reset, setReset] = useState(false)
  const prevPage = usePrevious(page)
  const [returnError, setReturnError] = useState(false)
  const [cityName, setCityName] = useState('')
  const prevCityName = usePrevious(cityName)
  const [wikiPageCoords, setWikiPageCoords] = useState({})
  const [cityCoords, setCityCoords] = useState({})
  const [wikiCoords, setWikiCoords] = useState([])
  const [coordsI, setCitiesI] = useState(0)

  const getGeosNearPlaceName = useCallback(async () => {
    fetch(`https://geocode.maps.co/search?q=${cityName}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseData) => {
        setCityCoords(responseData)
      })
      .catch((error) => {
        setReturnError(true)
        console.log(error)
      })
  }, [cityName])

  const setStyle = useCallback(async () => {
    const colors = paintings[page].colors
    let gradient = ''
    for (let i = colors.length; i--; ) {
      gradient += colors[i].color
      gradient += i === 0 ? ')' : ', '
    }
    document.body.style.background = `radial-gradient(circle at bottom right, ${gradient}`
  }, [page, paintings])

  //externalize this and return birthplace!!! TESTJpF
  const placeNameForReverseGeo = useCallback(
    (p) => {
      let birthplace =
        paintings[p].people && paintings[p].people.length > 0
          ? paintings[p].people[0].birthplace
          : null
      if (birthplace) {
        birthplace =
          birthplace.length > 23 ? birthplace.split(' ').pop() : birthplace
      } else {
        if (paintings[p].culture) {
          birthplace = countryLookup[paintings[p].culture]
            ? countryLookup[paintings[p].culture]
            : paintings[p].culture.split(' ').shift()
        } else if (paintings[p].period) {
          birthplace = paintings[p].period.split(' ').shift()
          console.log('paint PERIOD birthplace', birthplace)
        } else {
          birthplace =
            paintings[p].division.length > 23
              ? paintings[p].division.split(' ').shift()
              : paintings[p].division
        }
      }

      if (!birthplace) console.log(paintings[p])
      console.log('PAINTING placeNameForReverseGeo')
      setCityName(birthplace)
    },
    [paintings]
  )

  const updatePaintings = useCallback(() => {
    setStyle()
    placeNameForReverseGeo(page)
  }, [page, placeNameForReverseGeo, setStyle])

  useEffect(() => {
    console.log('reset prevPage, page', prevPage, page)
    console.log('paint RESET RESET RESET', reset)
    if (
      (page >= 0 && prevPage !== page) ||
      (reset === true && prevPage !== page)
    ) {
      console.log('UUU ||| Results ::: set birthplace - RESET', reset)
      updatePaintings()
      setReset(false)
    }
  }, [page, prevPage, reset, updatePaintings])

  useEffect(() => {
    if (cityName && cityName !== '' && prevCityName !== cityName) {
      getGeosNearPlaceName()
      console.log('UUU ||| Results ::: find geos near painting place')
    }
  }, [cityName, getGeosNearPlaceName, prevCityName, paintings])

  useEffect(() => {
    console.log('PAINTINGS CHANGED')
    //these two things will always be 0 and true at the same time!!! TESTJPF
    //setPage(0)
    //setReset(true)
    placeNameForReverseGeo(0)
  }, [paintings, placeNameForReverseGeo])

  //testjpf nedd to abstract this to a new painitng component??
  return (
    <main className="main">
      {paintings && paintings.length > 0 ? (
        <>
          {paintings[page] &&
            cityCoords &&
            cityCoords.length > 0 &&
            cityName !== '' && (
              <div>
                {console.log('painting comp in RESULTS!!!')}
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
              cityCoords &&
              cityCoords.length > 0 &&
              cityName !== '' && (
                <Wiki
                  setwikicoords={setWikiCoords}
                  setWikiPageCoords={setWikiPageCoords}
                  cityName={cityName}
                  coords={cityCoords}
                  coordsI={coordsI}
                />
              )}
            <div className="map">
              {/** 
            Wrong "america"??? next / prev | change wikiresults{' '}
            <p>Locations found for {cityName}:</p>*/}
              {cityCoords[0] &&
                page > -1 &&
                ((wikiCoords && wikiCoords.length > 0) ||
                  (wikiPageCoords && wikiPageCoords.length > 0)) && (
                  <Map
                    wikicoords={wikiCoords}
                    wikiPageCoords={wikiPageCoords}
                    coords={cityCoords}
                    setPaintingCoords={setCitiesI}
                    paintingPage={page}
                  />
                )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="render-coontainer">
            {returnError ? (
              <div className="search-error">
                ERROR: {this.props.title} did not return any results
              </div>
            ) : (
              <div className="painting flx-ctr">
                <div>
                  <svg className="loading" viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20"></circle>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
})
