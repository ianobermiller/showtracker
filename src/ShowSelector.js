import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import API from './API';
import TextInput from './TextInput';

@Radium
export default class ShowSelector extends Component {
  static propTypes = {
    onShowSelected: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    const localShows = localStorage.getItem('shows');
    let parsedLocalShows = null;
    try {
      parsedLocalShows = JSON.parse(localShows);
    } catch(e) {
      console.error('Failed to parse show db.');
    }

    this.state = {
      searchResults: null,
      existingShows: parsedLocalShows || [],
    };
  }

  _onSearch = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    API.search(event.target.value)
      .then(searchResults => {
        const newShows = searchResults.filter(
          show => !this.state.existingShows.some(
            otherShow => show.id === otherShow.id
          )
        );

        this.setState({searchResults: newShows});
      });
  };

  _onShowSelected = (show) => {
    if (this.state.searchResults) {
      const newShows = this.state.existingShows.concat(show);
      this.setState({
        query: '',
        searchResults: null,
        existingShows: newShows,
      });
      localStorage.setItem('shows', JSON.stringify(newShows));
    } else {
      this.props.onShowSelected(show);
    }
  };

  _onSearchQueryChange = (event) => {
    this.setState({query: event.target.value});
  };

  render() {
    const shows = this.state.searchResults ||
      this.state.existingShows.slice(0).sort(
        (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
    return (
      <div style={this.props.style}>
        <div style={{padding: 4}}>
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
          {shows.map((series, i) =>
            <li
              key={i}
              onClick={this._onShowSelected.bind(null, series)}
              style={{
                background: '#eee',
                cursor: 'pointer',
                listStyle: 'none',
                margin: 4,
                padding: 8,
              }}>
              <img
                src={series.imageURL}
                style={{height: 100, paddingRight: 12}}
              />
              {series.name} ({series.year})
            </li>
          )}
        </ul>
      </div>
    );
  }
}
