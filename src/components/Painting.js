import React, {
  createRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'
//import LandscapeIcon from '../assets/svg/landscape.svg'

export default React.memo(function Painting(props) {
  const { paintings, cityName, page, setPage } = props
  const [seed, setSeed] = useState(1)
  const labelRef = createRef()
  const timeouts = useMemo(() => [], [])

  function getWidth() {
    return `height=${Math.round(
      window.innerHeight * 1.2
    )}&width=${Math.round(window.innerWidth * 0.56)}`
  }

  const reloadImg = () => {
    cancelReload()
    reset()
  }

  const cancelReload = useCallback(async () => {
    for (let i = timeouts.length; i--; ) {
      clearTimeout(timeouts[i])
      timeouts.pop(i)
    }
  }, [timeouts])

  const reset = () => {
    setSeed(Math.random())
  }

  const AsyncImage = (props) => {
    const [loadedSrc, setLoadedSrc] = useState(null)
    useEffect(() => {
      setLoadedSrc(null)
      if (props.src) {
        const handleLoad = () => {
          setLoadedSrc(props.src)
        }
        const image = new Image()
        image.addEventListener('load', handleLoad)
        image.src = props.src

        return () => {
          image.removeEventListener('load', handleLoad)
        }
      }
    }, [props.src])
    if (loadedSrc === props.src) {
      page && labelRef.current.scrollIntoView({ behavior: 'smooth' })
      cancelReload()
      return <img {...props} />
    } else {
      timeouts.length < 1 && timeouts.push(setTimeout(reloadImg, 4000))
    }
    return (
      <div className="painting__image">
        <div className="flx-ctr fadein image__loading">
          {/**<img
            className="landscape_icon"
            src={LandscapeIcon}
            alt="random search term icon"
    />**/}
          <svg className="loading" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20"></circle>
          </svg>
        </div>
      </div>
    )
  }

  useEffect(() => {
    return () => {
      timeouts.length > 0 && cancelReload()
    }
  }, [cancelReload, timeouts.length])

  return (
    <>
      {paintings &&
      paintings.length > 0 &&
      paintings[page] &&
      cityName !== '' ? (
        <>
          <div ref={labelRef} className="heading">
            {paintings[page].title}
          </div>
          <div className="break"></div>
          <div className="frame__cell left ">
            <AsyncImage
              className=" left painting__image"
              key={seed}
              src={`${paintings[page].primaryimageurl}?${getWidth()}`}
              alt={'image of ' + paintings[page].title}
            />
          </div>
          <div className="frame__cell right">
            <div className="painting__label">
              <span className="label__title row">{paintings[page].title}</span>
              {paintings[page].people && paintings[page].people.length > 0 && (
                <span className="label__artist row">
                  {paintings[page].people[0].name}
                </span>
              )}
              <span className="label__region row">{cityName}</span>
              <span className="label__dated row">{paintings[page].dated}</span>
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
        </>
      ) : (
        <div className="render-coontainer">
          <div className="painting flx-ctr fadein">
            <svg className="loading" viewBox="25 25 50 50">
              <circle cx="50" cy="50" r="20"></circle>
            </svg>
          </div>
        </div>
      )}
    </>
  )
})
