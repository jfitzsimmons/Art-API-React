import React, { useState, useEffect, useCallback } from 'react'
import './App.scss'
import { Search } from './components/Search'
import Painting from './components/Painting'
import { objToQueryString } from './utils/helpers'

const ART_API_KEY = `${process.env.REACT_APP_ART_API_KEY}`

export default function App() {
  const [title, setTitle] = useState(
    'winter, spring, summer, fall, snow, leaves, heat, flowers'
  )
  const [records, setRecords] = useState({})
  // const [returnError, setReturnError] = useState(false)

  const updateTitle = (subject) => {
    setTitle(subject)
  }

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
      })
      .catch((error) => {
        // setReturnError(true)
        console.log(error)
      })
  }, [title])

  useEffect(() => {
    fetchPaintingData()
  }, [fetchPaintingData])

  return (
    <div id="App" className="App">
      <Search update={updateTitle} />
      {records && records[0] && <Painting paintings={records} />}
    </div>
  )
}
