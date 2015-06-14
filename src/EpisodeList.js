import React, {Component, PropTypes} from 'react';
import Radium, {Style} from 'radium';
import API from './API';

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
