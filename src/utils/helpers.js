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

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export const countryLookup = {
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

export const setStyle = (colors) => {
  let gradient = ''
  for (let i = colors.length; i--; ) {
    gradient += colors[i].color
    gradient += i === 0 ? ')' : ', '
  }
  document.body.style.background = `radial-gradient(circle at bottom right, ${gradient}`
}

export const placeNameForReverseGeo = (p) => {
  let birthplace =
    p.people && p.people.length > 0 ? p.people[0].birthplace : null
  if (birthplace) {
    birthplace =
      birthplace.length > 23 ? birthplace.split(' ').pop() : birthplace
  } else {
    if (p.culture) {
      birthplace = countryLookup[p.culture]
        ? countryLookup[p.culture]
        : p.culture.split(' ').shift()
    } else if (p.period) {
      birthplace = p.period.split(' ').shift()
    } else if (p.division) {
      birthplace =
        p.division.length > 23 ? p.division.split(' ').shift() : p.division
    }
  }

  if (!birthplace) console.log(p)
  return birthplace
}
