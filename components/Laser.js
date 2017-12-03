import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

const WIDTH = 0.01;
const HEIGHT = 0.01;
const LENGTH = 0.01;
const SPEED = 0.001;

class Laser extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let laser = (
      <ARKit.Sphere
        position={this.props.position}
        shape={{
          radius: 0.008,
        }}
        alpha={0.5}
        material={{
          doubleSided: false,
          color: 'green',
          alpha: 0.5,
        }}
      />
    );

    return laser;
  }
}

export default Laser;
