import React, {
  createRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'

const AsyncImage = React.memo((props) => {
  const { srcLoaded, srcLoading, src, alt, className } = props
  const [loadedSrc, setLoadedSrc] = useState(null)
  useEffect(() => {
    setLoadedSrc(null)
    if (src) {
      const handleLoad = () => {
        setLoadedSrc(src)
      }
      const image = new Image()
      image.addEventListener('load', handleLoad)
      image.src = src

      return () => {
        image.removeEventListener('load', handleLoad)
      }
    }
    return null
  }, [src])
  if (loadedSrc === src) {
    srcLoaded()
    return (
      <img
        className={className}
        src={src}
        alt={alt}
      />
    )
  }
  srcLoading()

  /** 
  if (loadedSrc === props.src) {
    
    labelRef.current.scrollIntoView({ behavior: 'smooth' })
    cancelReload()
    return <img {...props} />
  }
  timeouts.length < 1 && timeouts.push(setTimeout(reloadImg, 2500))
  */
  return (
    <div className="painting__image">
      <div className="flx-ctr fadein image__loading">
        {/** <img
          className="landscape_icon"
          src={LandscapeIcon}
          alt="random search term icon"
  />* */}
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
  )
})

export default React.memo((props) => {
  const { paintings, cityName, page, setPage } = props
  const [seed, setSeed] = useState(1)
  const labelRef = createRef()
  const timeouts = useMemo(() => [], [])

  function getWidth() {
    return `height=${Math.round(window.innerHeight * 1.2)}&width=${
      window.innerWidth < 632
        ? Math.round(window.innerWidth * 0.56)
        : Math.round(window.innerWidth * 0.9)
    }`
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

  const reloadImg = () => {
    cancelReload()
    reset()
  }

  function srcLoading() {
    timeouts.length < 1 && timeouts.push(setTimeout(reloadImg, 2500))
  }

  function srcLoaded() {
    labelRef.current && labelRef.current.scrollIntoView({ behavior: 'smooth' })
    cancelReload()
  }

  useEffect(
    () => () => {
      timeouts.length > 0 && cancelReload()
    },
    [cancelReload, timeouts.length],
  )

  return (
    <div className="painting__frame flx-ctr">
      {paintings &&
      paintings.length > 0 &&
      paintings[page] &&
      cityName !== '' ? (
        <>
          <div
            ref={labelRef}
            className="painting__heading"
          >
            {paintings[page].title}
          </div>
          <div className="break" />
          <div className="frame__cell left ">
            <AsyncImage
              className="left painting__image"
              key={seed}
              srcLoading={srcLoading}
              srcLoaded={srcLoaded}
              src={`${paintings[page].primaryimageurl}?${getWidth()}`}
              alt={`image of ${paintings[page].title}`}
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
              <span className="label__region row green">{cityName}</span>
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
      )}
    </div>
  )
})
