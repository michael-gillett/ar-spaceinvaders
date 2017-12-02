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
    this.state = {
      position: props.startPosition,
    };
  }

  componentDidMount() {
    intervalId = setInterval(this.updatePosition.bind(this), 20);
    this.setState({
      intervalId: intervalId,
    });
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  updatePosition() {
    this.setState({
      position: {
        ...this.state.position,
        z: this.state.position.z - SPEED,
      },
    });

    if (this.state.position.z < -5) {
      this.props.unmount(this.props.id);
    }
  }

  render() {
    let laser = (
      <ARKit.Box
        position={this.state.position}
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
