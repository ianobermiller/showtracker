import 'fetch-polyfill';

import EpisodeList from './EpisodeList';
import Radium from 'radium';
import React, {Component} from 'react';
import ShowSelector from './ShowSelector';

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
