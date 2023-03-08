import React, {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
} from 'react'
import './App.scss'
import Search from './components/Search'
import Results from './components/Results'
import { objToQueryString, makeid } from './utils/helpers'

const ART_API_KEY = `${process.env.REACT_APP_ART_API_KEY}`

export default function App() {
  const [title, setTitle] = useState(null)
  const [searchTrigger, setSearchTrigger] = useState(null)
  const [recordsState, setRecordsState] = useState({ records: {}, id: '' })
  const deferredRecordsState = useDeferredValue(recordsState)

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
        setRecordsState({
          records: responseData.records,
          id: makeid(6),
        })
      })
      .catch((error) => {
        // setReturnError(true)
        console.log(error)
      })
  }, [title])

  useEffect(() => {
    ;(title || title === '') && fetchPaintingData()
  }, [fetchPaintingData, title])

  return (
    <div id="App" className="App">
      <Search update={setTitle} searchTrigger={searchTrigger} />
      {deferredRecordsState && deferredRecordsState.id !== '' && (
        <>
          <Results //@ts-ignore
            paintings={deferredRecordsState.records}
            resultsId={deferredRecordsState.id}
            randomSearch={setSearchTrigger}
          />
        </>
      )}
    </div>
  )
}
