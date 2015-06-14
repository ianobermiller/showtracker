import 'fetch-polyfill';

import React, {Component, PropTypes} from 'react';
import Radium, {Style} from 'radium';
import * as API from './api';

@Radium
class TextInput extends Component {
  render() {
    const {style, ...propsWithoutStyle} = this.props;
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

@Radium
class ShowSelector extends Component {
  static propTypes = {
    onShowSelected: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    const localShows = localStorage.getItem('shows');
    let parsedLocalShows = null;
    try {
      parsedLocalShows = JSON.parse(localShows);
    } catch(e) {}

    this.state = {
      searchResults: null,
      existingShows: parsedLocalShows ||  [],
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

        this.setState({searchResults: newShows})
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

@Radium
export default class EpisodeList extends Component {
  static propTypes = {
    show: PropTypes.object,
  };

  constructor() {
    super();

    this.state = {
      episodes: null,
    };
  }

  componentWillMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.update(nextProps);
  }

  update(props) {
    if (!props.show) {
      if (this._lastShow) {
        this.setState({episodes: null});
      }
      return;
    }

    if (this._lastShow !== props.show) {
      API.getEpisodes(props.show.id).then(episodes => {
        this.setState({episodes});
      });
      this._lastShow = props.show;
    }
  }

  render() {
    var episodes = this.state.episodes &&
      this.state.episodes.slice(0).reverse();
    return (
      <div className="EpisodeList" style={this.props.style}>
        <Style
          scopeSelector=".EpisodeList"
          rules={{
            a: {
              color: 'black'
            },
            'a:visited': {
              color: '#666'
            }
          }}
        />
        <h1 style={{
          fontSize: 24,
          margin: 4,
        }}>
          {this.props.show && this.props.show.name}
        </h1>
        <ul>
        {episodes && episodes.map(episode => {
          const watchURL = 'http://yify-streaming.com/' +
            this.props.show.name.toLowerCase().replace(/[^a-z]+/g, '-') +
            '-season-' + episode.seasonNumber +
            '-episode-' + episode.episodeNumber;
          const number = episode.seasonNumber + 'x' + episode.episodeNumber;

          return (
            <li
              key={number}
              style={{
                background: '#eee',
                listStyle: 'none',
                margin: 4,
                minHeight: 96,
                padding: 8,
              }}>
              <a href={watchURL} style={{display: 'flex'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex'}}>
                    <span style={{fontWeight: 'bold', flex: 1}}>
                      {number + ' - ' + episode.name}
                    </span>
                    <span style={{fontSize: 14}}>
                      {episode.airDate}
                    </span>
                  </div>
                  <div style={{fontSize: 14}}>
                    {episode.summary}
                  </div>
                </div>
                <img
                  src={episode.imageURL}
                  style={{height: 80, marginLeft: 12}}
                />
              </a>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }
}

@Radium
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      selectedShow: null,
    };
  }

  _onShowSelected = (show) => {
    this.setState({selectedShow: show});
  };

  render() {
    return (
      <div style={{
        maxHeight: 'calc(100% - 16px)',
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        <div style={{display: 'flex'}}>
          <ShowSelector
            onShowSelected={this._onShowSelected}
            style={{flex: 1, overflowY: 'auto', minHeight: 0}}
          />
          <EpisodeList
            show={this.state.selectedShow}
            style={{flex: 2, overflowY: 'auto', minHeight: 0}}
          />
        </div>
        <div>
          <a
            href="http://www.tvmaze.com/"
            style={{fontSize: 10, lineHeight: '16px'}}>
            Powered by TVMaze
          </a>
        </div>
      </div>
    );
  }
}
