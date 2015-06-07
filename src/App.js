import 'fetch-polyfill';

import React, {Component} from 'react';
import Radium from 'radium';
import * as API from './api';

@Radium.Enhancer
class TextInput extends Component {
  render() {
    var {style, ...propsWithoutStyle} = this.props;
    return (
      <input
        style={[{
          background: 'white',
          border: '1px solid #666',
          height: 32,
          lineHeight: '32px',
          padding: '0 8px',
          width: '100%',
        }, style]}
        type="text"
        {...propsWithoutStyle}
      />
    );
  }
}

@Radium.Enhancer
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      searchResults: [],
    };
  }

  _onSearch = (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    API.search(event.target.value)
      .then(searchResults => this.setState({searchResults}));
  };

  render() {
    return (
      <div style={{
        margin: '0 auto',
        width: 400,
      }}>
        <div>
          <TextInput
            onKeyDown={this._onSearch}
            placeholder="Search for a show to add"
          />
        </div>
        <ul style={{
          margin: 0,
          padding: 0
        }}>
          {this.state.searchResults.map((series, i) =>
            <li
              key={i}
              style={{
                background: '#eee',
                listStyle: 'none',
                marginTop: 4,
                padding: 8,
              }}>
              {series.title} ({series.year})
            </li>
          )}
        </ul>
      </div>
    );
  }
}
