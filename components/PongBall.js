import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

class PongBall extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ARKit.Sphere
        position={this.props.position}
        transition={{ duration: 0.1 }}
        shape={{
          radius: 0.1,
        }}
      />
    );
  }
}

export default PongBall;
