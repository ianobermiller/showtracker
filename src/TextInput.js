import React, {Component} from 'react';
import Radium from 'radium';

@Radium
export default class TextInput extends Component {
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
