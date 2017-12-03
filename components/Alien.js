import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

class Alien extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ARKit.Model
        position={this.props.position}
        eulerAngles={this.props.rotation}
        id={this.props.id}
        model={{
          file: 'art.scnassets/alien.dae', // make sure you have the model file in the ios project
          scale: 0.05,
        }}
      />
    );
  }
}

export default Alien;
