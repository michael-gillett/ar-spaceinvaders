import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

class CrossHair extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
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
    ARKit.getCameraPosition().then(pos => {
      this.setState({
        position: {
          ...pos,
          z: this.props.planeCenter.z - this.props.planeSize.z / 2 + 0.2,
        },
      });
    });
  }

  render() {
    let crosshair = (
      <ARKit.Sphere
        position={this.state.position}
        transition={{ duration: 0.1 }}
        shape={{
          radius: 0.01,
        }}
        material={{
          color: 'yellow',
        }}
      />
    );
    return crosshair;
  }
}

export default CrossHair;
