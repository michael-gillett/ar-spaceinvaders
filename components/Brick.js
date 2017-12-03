import React, { Component } from 'react';
import { View } from 'react-native';
import { ARKit } from 'react-native-arkit';

class Brick extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ARKit.Box
        // model={{
        //   file: 'art.scnassets/alien.scn', // make sure you have the model file in the ios project
        // }}
        position={this.props.position}
        id={this.props.id}
        // scale={0.2}
        shape={this.props.shape}
        material={{
          // blendMode: ARKit.BlendMode.Screen,
          color: 'purple', //this.props.yIdx + this.props.xIdx) % 2 == 0 ? 'red' : 'blue',
        }}
      />
    );
  }
}

export default Brick;
