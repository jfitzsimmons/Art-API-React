import React, {useState, useEffect, useCallback} from 'react';
import './App.scss';
import {Search} from './components/Search';
import Painting from './components/Painting';

const ART_API_KEY = `${process.env.REACT_APP_ART_API_KEY}`;

export default function App(props) {
  const [title, setTitle] = useState("sprint, winter, summer, fall"); 
  //const [title, setTitle] = useState(""); 

  const [records, setRecords] = useState({}); 
  //const [page, setPage] = useState(-1)
  const [returnError, setReturnError] = useState(false)

  const updateTitle = (subject) => {
    setTitle(subject);
  }

  const objToQueryString = (obj) => {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
  }

//testjpf 
//https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=130&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=44.8111821|-68.7778138
//this will get me articel with extarcts by latlong!!!

  const fetchPaintingData = useCallback(() => {
    const queryString = () => {
      return objToQueryString({
        apikey: ART_API_KEY,
        title: title,
        classification: 'Paintings',
        hasimage: 1,
        q: 'imagepermissionlevel:0 AND (verificationlevel:4)',
        //person: 'any',
        sort: 'random',
        //color: 'any',
      })
    }
    fetch(`https://api.harvardartmuseums.org/object?${queryString()}`, {
        method: 'GET'
      }).then((response) => response.json())
      .then((responseData) => {
         setRecords(responseData.records);
         console.log(responseData.records)
         //(records.length === 0) ? setReturnError(true) : setPage(0);
      }).catch((error) => {
        setReturnError(true);
        console.log(error);
      });
    },
    [title],
  );

    // Similar to componentDidMount and componentDidUpdate:  
    useEffect(() => {
      //Runs on the first render
      //And any time any dependency value changes
      fetchPaintingData();
    }, [fetchPaintingData]);

  return (
      <div id = "App" className = "App" >
        <Search update={updateTitle}/>
        {
       (records && records[0]) &&

        <Painting title = {title} records = {records} />
}
      </div>
    );
  }
