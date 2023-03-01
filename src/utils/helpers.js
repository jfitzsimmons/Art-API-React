import { useEffect, useRef } from 'react'

export function paginate(direction) {
  this.setState((prevState) => {
    return { page: (prevState.page += direction) }
  })
}

export const objToQueryString = (obj) => {
  const keyValuePairs = []
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    )
  }
  return keyValuePairs.join('&')
}

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}
