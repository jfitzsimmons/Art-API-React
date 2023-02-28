import React, { useState, useEffect, useCallback } from 'react'
import Wiki from './Wiki'

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
}

//testjpf painting ID is used to get object that has places
//use place id to get lat long.  use lat long to get wikipeida search results
// update map with  marker for paint place and wikipedia results?
//make it so if you click on marker it takes you to that "page" in pagination for wiki result

export default function Painting(props) {
  const { records } = props
  const [page, setPage] = useState(0)
  const [returnError, setReturnError] = useState(false)
  const [city, setCity] = useState('')

  const setStyle = useCallback(async () => {
    const colors = records[page].colors
    let gradient = ''
    for (let i = colors.length; i--; ) {
      gradient += colors[i].color
      gradient += i === 0 ? ')' : ', '
    }
    document.body.style.background = `radial-gradient(circle at bottom right, ${gradient}`
  }, [page, records])

  const findCity = useCallback(() => {
    console.log('findcity - records[page].period', records[page].period)
    //if (records[page].period)
    // console.log(records[page].period.split(' ').shift())

    let birthplace =
      records[page].people && records[page].people.length > 0
        ? records[page].people[0].birthplace
        : null
    if (birthplace) {
      birthplace =
        birthplace.length > 23 ? birthplace.split(' ').pop() : birthplace
    } else {
      if (records[page].culture) {
        console.log('CULTURE', records[page].culture)
        birthplace = countryLookup[records[page].culture]
      } else if (records[page].period) {
        console.log('TRUE', records[page].period)
        birthplace = records[page].period.split(' ').shift()
      } else {
        console.log('ELSE')
        birthplace =
          records[page].division.length > 23
            ? records[page].division.split(' ').shift()
            : records[page].division
      }
    }
    console.log('setCity birthplace', birthplace)
    setCity(birthplace)
  }, [page, records])

  useEffect(() => {
    setStyle()
    findCity()
  }, [findCity, page, setStyle])

  return (
    <div>
      {records && records.length > 0 ? (
        <div>
          <div className="render-coontainer">
            <div className="painting flx-ctr">
              <div className="painting__frame flx-ctr">
                <span className="heading">{records[page].title}</span>
                <div className="frame__cell left">
                  <img
                    className="painting__image"
                    src={records[page].primaryimageurl}
                    alt={'image of ' + records[page].title}
                  />
                </div>
                <div className="frame__cell right">
                  <div className="painting__label">
                    <span className="label__title row">
                      {records[page].title}
                    </span>
                    {records[page].people &&
                      records[page].people.length > 0 && (
                        <span className="label__artist row">
                          {records[page].people[0].name}
                        </span>
                      )}
                    <span className="label__region row">{city}</span>
                    <span className="label__dated row">
                      {records[page].dated}
                    </span>
                    <span className="label__period row">
                      {records[page].period}
                    </span>
                    <span className="label__medium row">
                      {records[page].medium}
                    </span>
                  </div>
                  <div className="painting__paging page">
                    {page + 1} of {records.length}
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
                      disabled={page === records.length - 1}
                    >
                      next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {<Wiki city={city} />}
        </div>
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
    </div>
  )
}
