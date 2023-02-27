import React, {useState, useEffect, useCallback} from 'react';
//import './App.scss';
import {Wiki} from './Wiki';
//import {paginate} from '../utils/helpers';

const ART_API_KEY = `${process.env.REACT_APP_ART_API_KEY}`;

//testjpf need to start from beginning
//map and wiki need to be on same level (remove mao from wiki)
// same with paintng, put them all under app
//painintings is fetched from app, sent to painitg, 

//pinting ID is used to get object that has places
//use place id to get lat long.  use lat long to get wikipeida search results
// update map with  marker for paint place and wikipedia results?  
//make it so if you click on marker it takes you to that "page" in pagination for wiki result


export default function Painting(props) {
  const {title, records }=props;
  const [page, setPage] = useState(0)
  const [returnError, setReturnError] = useState(false)
  
 // const [records, setReturnError] = useState(false)

    //page=0
    //records = records
    //this.paginate = paginate.bind(this);
   // this.setCity = this.setCity.bind(this);


  const getCssValuePrefix = () => {
      let rtrnVal = '';
      const prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];
      let dom = document.createElement('div');
      for (var i = 0; i < prefixes.length; i++) {
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';
        if (dom.style.background) rtrnVal = prefixes[i];
      }
      dom = null;
      return this.setStyle(rtrnVal);
  }

  const setStyle = (prefix) => {
    const colors = records[page].colors;
    let gradient = '';
    for (let i = colors.length; i--;) {
      gradient += colors[i].color;
      gradient += (i===0) ? ')' : ', ';
    }
    document.body.style.background = `radial-gradient(circle at bottom right, ${gradient}`;
  };





  //testjpf this works..  start here:::
  const fetchLocationData = useCallback(() => {    fetch(`https://geocode.maps.co/search?q=${setCity()}`, {
        method: 'GET'
      }).then((response) => response.json())
      .then((responseData) => {
         //records = responseData;
        console.dir(responseData)
       // console.log(responseData.places[page].placeid)
        const city = responseData[0]
        //testjpf instead do an object serach based on "parentID" "Place" get nearby art?
        //use same id to get nearby wiki results
        console.log("city.lat",city.lat,"city.lon",city.lon)
        return  fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exchars=130&exintro=true&generator=geosearch&ggsradius=10000&ggscoord=54.9728368|-2.2449558`, {method: 'GET'})

       // return  fetch(`https://api.harvardartmuseums.org/object?hasimage=1&q=imagepermissionlevel:0AND(verificationlevel:4)&sort=random&place=Brooklyn&apikey=${ART_API_KEY}`, {method: 'GET'})
        .then((testjpf1) => testjpf1.json()).then((testjpf2) => {
          //records = responseData;
          console.log("NESTED")
         console.dir(testjpf2)

        })
         //(records.length === 0) ? this.setState({returnError: true}) : this.setState({page: 0});
      }).catch((error) => {
        setReturnError(true);
        console.log(error);
      });
    },
    [],
  );

  const setCity = () => {
   // const birthplace = null;
    const birthplace = records[page].people && records[page].people.length > 0 ? records[page].people[0].birthplace : null
    if (birthplace) {
      return (birthplace.length > 23) ? birthplace.split(" ").pop() : birthplace;
    } else  if (records[page].culture) {
      return records[page].culture;
    } else {
      const division = records[page].division;
      return division.substr(0,division.indexOf(' '));
    }
  }

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    fetchLocationData();
  }, [fetchLocationData, page]);

    //if (records && records[page]) {
    //  console.log(records[page].title)
     // this.getCssValuePrefix();
      return (
        <div>
          {

(records && records.length > 0) ?
          <div>
          <div className = "render-coontainer">
            <div className = "painting flx-ctr">
              <div className = "painting__frame flx-ctr">
                <span className = "heading">{records[page].title}</span>
                <div className = "frame__cell left">
                  <img className="painting__image" src={records[page].primaryimageurl} alt={"image of " + records[page].title} />
                </div>
                <div className = "frame__cell right">
                  <div className = "painting__label">
                    <span className = "label__title row">{records[page].title}</span>
                    {(records[page].people && records[page].people.length > 0) && <span className = "label__artist row">{records[page].people[0].name}</span>}
                    <span className = "label__region row">{setCity()}</span>
                    <span className = "label__dated row">{records[page].dated}</span>
                    <span className = "label__period row">{records[page].period}</span>
                    <span className = "label__medium row">{records[page].medium}</span>
                  </div>
                  <div className="painting__paging page">
                    {page + 1} of {records.length}
                    <br/>
                  <button className="prev" onClick={() => setPage(page-1)} disabled={page === 0}>previous</button> | <button className="next" onClick={() => setPage(page+1)} disabled={page === records.length-1}>next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/**<Wiki city = {this.setCity()} update={this.updateLatLng}/>**/}
</div>
    //  
   // else 
    //  let returnError = this.state.returnError;
     // return (
      :
        <div>
          <div className = "render-coontainer">
            {returnError ?
            <div className = "search-error">
              ERROR: {this.props.title} did not return any results
            </div>
          :
            <div className = "painting flx-ctr">
              <div>
                <svg className="loading" viewBox="25 25 50 50">
                  <circle cx="50" cy="50" r="20"></circle>
                </svg>
              </div>
            </div>
          }
          </div>
        </div>
}
</div>
      );
    }


