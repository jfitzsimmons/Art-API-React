import React, { useState, useEffect, useCallback } from 'react'
import './App.scss'
import { Search } from './components/Search'
import Results from './components/Results'
import { objToQueryString, makeid } from './utils/helpers'

const ART_API_KEY = `${process.env.REACT_APP_ART_API_KEY}`

const initialTitles = [
  'winter, spring, summer, fall',
  'earth, wind, fire, water',
  'moon, sun, stars, sky',
  'heaven, hell, angel, demon',
  'flowers, plants, trees, grass',
  'mountain, prairie, field, hill',
  'gathering, party, celebration, festive',
  'sea, ocean, river, lake',
  'gold, silver, bronze, brass',
  'day, night, dusk, dawn',
  'north, south, east, west',
  'rain, snow, thunder, fog',
  'town, village, city, country',
  'music, melody, harmony, song',
  'street, path, road, trail',
]

export default function App() {
  const initialTitle = initialTitles[(Math.random() * initialTitles.length) | 0]
  const [title, setTitle] = useState(initialTitle)
  const [records, setRecords] = useState({})
  const [resultsId, setResultsId] = useState(0)

  // const [returnError, setReturnError] = useState(false)

  const fetchPaintingData = useCallback(() => {
    const queryString = () => {
      return objToQueryString({
        apikey: ART_API_KEY,
        title: title,
        classification: 'Paintings',
        hasimage: 1,
        q: 'imagepermissionlevel:0 AND (verificationlevel:3 OR verificationlevel:4)',
        sort: 'random',
      })
    }
    fetch(`https://api.harvardartmuseums.org/object?${queryString()}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRecords(responseData.records)
        setResultsId(makeid(6))
      })
      .catch((error) => {
        // setReturnError(true)
        console.log(error)
      })
  }, [title])

  useEffect(() => {
    fetchPaintingData()
  }, [fetchPaintingData])

  const generateInitialTitle = () => {
    const outputTags = []
    initialTitle.split(/\s*,\s*/).forEach(function (term) {
      outputTags.push({
        id: term,
        text: term.charAt(0).toUpperCase() + term.slice(1),
      })
    })
    return outputTags
  }

  return (
    <div id="App" className="App">
      <Search update={setTitle} initialTitle={generateInitialTitle()} />
      {records && records[0] && (
        <Results paintings={records} resultsId={resultsId} />
      )}
    </div>
  )
}
