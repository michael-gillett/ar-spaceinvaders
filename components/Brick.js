import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

const WIDTH = 0.15;
const HEIGHT = 0.1;
const LENGTH = 0.1;

class Brick extends Component {
  constructor(props) {
    super(props);
  }

  getPosition() {
    let backLeftCorner =
      this.props.planeCenter.x - this.props.planeSize.x / 2 + WIDTH / 2;
    return {
      x: backLeftCorner + this.props.xIdx * WIDTH,
      y: this.props.planeCenter.y + HEIGHT / 2 + this.props.yIdx * HEIGHT,
      z: this.props.planeCenter.z - this.props.planeSize.z / 2 + LENGTH / 2,
    };
  }

  render() {
    return (
      <ARKit.Box
        position={this.getPosition()}
        shape={{ width: WIDTH, height: HEIGHT, length: LENGTH, chamfer: 0.005 }}
        material={{
          blendMode: ARKit.BlendMode.Alpha,
          color: (this.props.yIdx + this.props.xIdx) % 2 == 0 ? 'red' : 'blue',
          transparency: 0.9,
        }}
      />
    );
  }
}

export default Brick;
