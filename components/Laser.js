import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

const WIDTH = 0.01;
const HEIGHT = 0.01;
const LENGTH = 0.1;
const SPEED = 0.1;

class Laser extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let laser = (
      <ARKit.Box
        position={this.props.position}
        shape={{ width: WIDTH, height: HEIGHT, length: LENGTH, chamfer: 0.005 }}
        material={{
          blendMode: ARKit.BlendMode.Screen,
          color: 'red',
        }}
      />
    );

    return laser;
  }
}

export default Laser;
