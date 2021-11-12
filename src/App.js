import React, {PureComponent} from 'react';
import './App.scss';
import {Search} from './Search.js';
import {Painting} from './Painting.js';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: "earth, wind, fire"
    }
    this.updateTitle = this.updateTitle.bind(this);
  }

  updateTitle(subject) {
    this.setState({title: subject});
  }

  render() {
    return (
      <div id = "App" className = "App" >
        <Search update={this.updateTitle}/>
        <Painting title = {this.state.title} />
      </div>
    );
  }
}