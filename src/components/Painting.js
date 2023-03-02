import React, { useState, useEffect, useCallback } from 'react'
import Wiki from './Wiki'
import Map from './Map'
//import { shuffle } from '../utils/helpers'
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
}

//testjpf painting ID is used to get object that has places
//use place id to get lat long.  use lat long to get wikipeida search results
// update map with  marker for paint place and wikipedia results?
//make it so if you click on marker it takes you to that "page" in pagination for wiki result

export default function Painting(props) {
  const { paintings } = props
  const [page, setPage] = useState(0)
  const [returnError, setReturnError] = useState(false)
  const [cityName, setCityName] = useState('')
  const [cityGeoI, setCityGeoI] = useState([])
  const [cityCoords, setCityCoords] = useState({})
  const [wikiCoords, setWikiCoords] = useState([])
  const [coordsI, setCitiesI] = useState(0)

  const getGeosNearPlaceName = useCallback(async () => {
    console.log('getGeosNearPlaceName cityName', cityName)

    fetch(`https://geocode.maps.co/search?q=${cityName}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('cityCoords')
        console.dir(responseData)
        //trstjpf randomy sort cityCoords!!!
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

  const placeNameForReverseGeo = useCallback(() => {
    // console.log('findcityName - paintings[page].period', paintings[page].period)
    //if (paintings[page].period)
    // console.log(paintings[page].period.split(' ').shift())

    let birthplace =
      paintings[page].people && paintings[page].people.length > 0
        ? paintings[page].people[0].birthplace
        : null
    if (birthplace) {
      birthplace =
        birthplace.length > 23 ? birthplace.split(' ').pop() : birthplace
    } else {
      if (paintings[page].culture) {
        console.log('CULTURE', paintings[page].culture)
        birthplace = countryLookup[paintings[page].culture]
      } else if (paintings[page].period) {
        console.log('TRUE', paintings[page].period)
        birthplace = paintings[page].period.split(' ').shift()
      } else {
        console.log('ELSE')
        birthplace =
          paintings[page].division.length > 23
            ? paintings[page].division.split(' ').shift()
            : paintings[page].division
      }
    }
    //console.log('setCityName birthplace', birthplace)
    setCityName(birthplace)
  }, [page, paintings])

  useEffect(() => {
    console.log('useEffect ::: page', page)

    setStyle()
    placeNameForReverseGeo()
  }, [placeNameForReverseGeo, page, setStyle])

  useEffect(() => {
    console.log('useEffect ::: cityName', cityName)

    cityName && cityName !== '' && getGeosNearPlaceName()
  }, [cityName, getGeosNearPlaceName])

  useEffect(() => {
    console.log('useEffect ::: cityGeoI', cityGeoI)
  }, [cityGeoI])
  //testjpf nedd to abstract this to a new painitng component??
  return (
    <main class="main">
      {paintings && paintings.length > 0 ? (
        <>
          <div className="painting__frame flx-ctr">
            <span className="heading">{paintings[page].title}</span>
            <div className="frame__cell left">
              <img
                className="painting__image"
                src={paintings[page].primaryimageurl}
                alt={'image of ' + paintings[page].title}
              />
            </div>
            <div className="frame__cell right">
              <div className="painting__label">
                <span className="label__title row">
                  {paintings[page].title}
                </span>
                {paintings[page].people &&
                  paintings[page].people.length > 0 && (
                    <span className="label__artist row">
                      {paintings[page].people[0].name}
                    </span>
                  )}
                <span className="label__region row">{cityName}</span>
                <span className="label__dated row">
                  {paintings[page].dated}
                </span>
                <span className="label__period row">
                  {paintings[page].period}
                </span>
                <span className="label__medium row">
                  {paintings[page].medium}
                </span>
              </div>

              <div className="painting__paging page">
                {page + 1} of {paintings.length}
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
                  disabled={page === paintings.length - 1}
                >
                  next
                </button>
              </div>
            </div>
          </div>
          <div className="map-wiki flx-ctr wrap">
            <Wiki
              setwikicoords={setWikiCoords}
              setcitygeoi={setCityGeoI}
              cityName={cityName}
              coords={cityCoords}
              coordsI={coordsI}
            />
            <div className="map">
              {/** 
            Wrong "america"??? next / prev | change wikiresults{' '}
            <p>Locations found for {cityName}:</p>*/}
              {cityCoords[0] && (
                <Map
                  wikicoords={wikiCoords}
                  cityGeoI={cityGeoI}
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
}
