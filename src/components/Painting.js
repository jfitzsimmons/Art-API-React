import React from 'react'
import { usePrevious } from '../utils/helpers'

//testjpf painting ID is used to get object that has places
//use place id to get lat long.  use lat long to get wikipeida search results
// update map with  marker for paint place and wikipedia results?
//make it so if you click on marker it takes you to that "page" in pagination for wiki result

export default React.memo(function Painting(props) {
  const { paintings, cityName, page, setPage } = props
  const prevTitle = usePrevious(cityName)

  //testjpf nedd to abstract this to a new painitng component??

  //testjpf start here too many call just in painting paging
  //what is i processed props into local state with useEffect
  //and populated return with localstate

  return (
    <>
      {paintings &&
      paintings.length > 0 &&
      paintings[page] &&
      cityName !== '' ? (
        <>
          {console.log('RRR ||| PAINTING RETURN')}
          <div className="painting__frame flx-ctr">
            <div className="heading">{paintings[page].title}</div>
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
        </>
      ) : (
        <div>
          <div className="render-coontainer">
            <div className="painting flx-ctr">
              <div>
                <svg className="loading" viewBox="25 25 50 50">
                  <circle cx="50" cy="50" r="20"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
