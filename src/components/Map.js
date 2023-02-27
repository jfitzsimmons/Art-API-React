import React, {PureComponent} from 'react';
import GoogleMapReact from 'google-map-react';
import {MapMarker} from './MapMarker.js';
//import './App.scss';

const MAP_API_KEY = `${process.env.REACT_APP_MAP_API_KEY}`;

export class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: this.props.lat,
        lng: this.props.lng
      }
    }
    this.zoom = 10;
  }

  componentDidUpdate(prevProps) {
    if (this.props.lat !== prevProps.lat) {
      this.setState({
       center: {
         lat: this.props.lat,
         lng: this.props.lng
       }
      })
    }
  }

  render() {
    if (this.state.center) {
      return (
        <div className="map-container">
          <GoogleMapReact
            bootstrapURLKeys={{ key: MAP_API_KEY }}
            center={this.state.center}
            zoom={this.zoom}
          >
            <MapMarker
              lat={this.state.center.lat}
              lng={this.state.center.lng}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>

      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
