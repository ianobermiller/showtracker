import 'fetch-polyfill';

import React, {Component, PropTypes} from 'react';
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
class ShowSelector extends Component {
  static propTypes = {
    existingShows: PropTypes.array.isRequired,
    onShowSelected: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      searchResults: null,
    };
  }

  _onSearch = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    API.search(event.target.value)
      .then(searchResults => {
        var newShows = searchResults.filter(
          show => !this.props.existingShows.some(
            otherShow => show.id === otherShow.id
          )
        );

        this.setState({searchResults: newShows})
      });
  };

  _onShowSelected = (show) => {
    this.setState({
      query: '',
      searchResults: null,
    });

    this.props.onShowSelected(show);
  };

  _onSearchQueryChange = (event) => {
    this.setState({query: event.target.value});
  };

  render() {
    return (
      <div style={this.props.style}>
        <div>
          <TextInput
            onChange={this._onSearchQueryChange}
            onKeyDown={this._onSearch}
            placeholder="Search for a show to add"
            value={this.state.query}
          />
        </div>
        <ul style={{
          margin: 0,
          padding: 0
        }}>
          {(this.state.searchResults || this.props.existingShows).map((series, i) =>
            <li
              key={i}
              onClick={this._onShowSelected.bind(null, series)}
              style={{
                background: '#eee',
                cursor: 'pointer',
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

@Radium.Enhancer
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      shows: [],
    };
  }

  _onShowSelected = (show) => {
    this.setState({
      shows: this.state.shows.concat(show),
    });
  };

  render() {
    return (
      <div style={{display: 'flex'}}>
        <ShowSelector
          existingShows={this.state.shows}
          onShowSelected={this._onShowSelected}
          style={{flex: 1}}
        />
        <div style={{flex: 1}} />
      </div>
    );
  }
}
