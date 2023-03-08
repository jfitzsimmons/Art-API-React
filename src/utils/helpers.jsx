import { useEffect, useRef } from 'react'

export const objToQueryString = (obj) => {
  const keyValuePairs = []
  Object.keys(obj).forEach((key) => {
    keyValuePairs.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
    )
  })
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
  const a = array
  let currentIndex = array.length
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    ;[a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]]
  }

  return a
}

export const countryLookup = {
  Italian: 'Italy',
  French: 'France',
  American: 'United States',
  Indian: 'New Delhi',
  India: 'New Delhi',
  Chinese: 'Beijing',
  Japanese: 'Japan',
  Dutch: 'Netherlands',
  German: 'Germany',
  Korean: 'Seoul',
  Persian: 'Iran',
  British: 'Britain',
  Netherlandish: 'Netherlands',
  Russian: 'Moscow',
  Spanish: 'Barcelona',
  Nepalese: 'Nepal',
  Hurrian: 'Anatolia',
  Byzantine: 'Istanbul',
}

export const setStyle = (colors) => {
  const ha = ['left', 'center', 'right']
  const va = ['top', 'center', 'bottom']
  let gradient = ''
  for (let i = colors.length; i--; ) {
    gradient += colors[i].color
    gradient += i === 0 ? ')' : ', '
  }

  document.body.style.background = `radial-gradient(circle at ${
    ha[(Math.random() * 3) | 0]
  } ${va[(Math.random() * 3) | 0]}, ${gradient}`
}

export const placeNameForReverseGeo = (p) => {
  let birthplace =
    p.people && p.people.length > 0 && p.people[0].birthplace
      ? p.people[0].birthplace
      : null
  // console.log('b1: ', birthplace)
  if (birthplace) {
    birthplace =
      birthplace.length > 20 ? birthplace.split(' ').pop() : birthplace
    // console.log('b2: ', birthplace)
  } else if (p.culture) {
    birthplace = p.culture
    // console.log('b3: ', birthplace)
  } else if (p.period) {
    birthplace = p.period.split(' ').shift()
    // console.log('b4: ', birthplace)
  } else if (p.division) {
    birthplace =
      p.division.length > 23 ? p.division.split(' ').shift() : p.division
    // console.log('b5: ', birthplace)
  }

  if (!birthplace) console.log(p)
  return birthplace.replace('?', '')
}

export function makeid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}
