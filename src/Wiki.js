import React, { Component } from 'react';
import './App.scss';
import { Map } from './Map.js';
import { paginate } from './Helpers.js';

const WIKI_TOKEN = `${process.env.REACT_APP_WIKI_TOKEN}`;
const WIKI_USER = `${process.env.REACT_APP_WIKI_ACCT}`;

export class Wiki extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: -1
    }
    this.geonames = {}
    this.paginate = paginate.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.city !== prevProps.city) {
      this.getWikiData(this.props.city);
    }
  }


  async getWikiData(c) {

    const myHeaders = new Headers();

    myHeaders.append('Api-User-Agent', 'Example/1.0');
    myHeaders.append("Origin", "http://localhost:3000/Art-API-React");
    let city = c.replace(/ \(.*/g, '').replace(/\?/g, '');
    city = city.split(",")[0];
    console.log(`city: ${city}`)

    /**
     * RETHINK FUNCTIONALITY
     * TEST JPF
     */

    let url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=geosearch&gspage=${city}&gsradius=10000&gslimit=10`;
    let response = await fetch(url,
      {
        method: 'GET',
        headers: myHeaders,
      }
    );
    response.json()
      .then((responseData) => {
        this.geonames = responseData.query.geosearch;
        console.log('this.geonames')
        console.dir(this.geonames)
        this.setState({
          page: 0
        })
      }).catch(console.error);



  }

  componentDidMount() {
    this.getWikiData(this.props.city);
  }

  render() {
    if (this.geonames && this.geonames[this.state.page]) {
      console.dir(this.geonames);
      return (
        <div className="map-wiki flx-ctr wrap">
          <div className="wiki">
            <div className="wiki__results">
              <span className="label__title row">Wikipedia results for {this.props.city}:</span>
              <span className="label__title row">{this.geonames[this.state.page].title}</span>
              {this.geonames[this.state.page].description}
              <br />
              <a className="wiki__link row" href={`https://${this.geonames[this.state.page].wikipediaUrl}`}>{this.geonames[this.state.page].title} on wikipedia</a>
            </div>
            <div className="page">
              {this.state.page + 1} of {this.geonames.length}
              <br />
              <button className="prev" onClick={() => this.paginate(-1)} disabled={this.state.page === 0}>previous</button> | <button className="next" onClick={() => this.paginate(1)} disabled={this.state.page === this.geonames.length - 1}>next</button>
            </div>
          </div>
          <div className="map">
            <Map lat={this.geonames[this.state.page].lat} lng={this.geonames[this.state.page].lon} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="map-wiki flx-ctr wrap">
          <div className="wiki">
            <div>
              <svg className="loading" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"></circle>
              </svg>
            </div>
          </div>
        </div>
      );
    };
  }
};
