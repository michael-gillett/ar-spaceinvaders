import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { ARKit } from 'react-native-arkit';
import PongBall from './components/PongBall';
import Brick from './components/Brick';
import CrossHair from './components/CrossHair';
import UI from './components/UI';
import Laser from './components/Laser';

export default class ReactNativeARKit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: { x: 0, y: 0, z: -1 },
      dir: -1,
      planes: null,
      lasers: [],
    };
  }

  componentDidMount() {
    setInterval(this.moveBall.bind(this), 20);
  }

  moveBall() {
    if (this.state.position.z < -4) {
      this.setState({
        dir: 1,
      });
    } else if (this.state.position.z > -1) {
      this.setState({
        dir: -1,
      });
    }

    this.setState({
      ballPosition: {
        z: (this.state.position.z += 0.1 * this.state.dir),
      },
    });
  }

  planeDetection(plane) {
    this.setState({
      plane: plane,
    });
  }

  fireLaser() {
    ARKit.getCameraPosition().then(pos => {
      let tmpLasers = this.state.lasers;
      tmpLasers.push(<Laser startPosition={pos} />);
      this.setState({
        lasers: tmpLasers,
      });
    });
  }

  render() {
    let bricks = [];
    if (this.state.plane) {
      for (x = 0; x < 10; x++) {
        for (y = 0; y < 10; y++) {
          bricks.push(
            <Brick
              planeCenter={this.state.plane.node}
              planeSize={this.state.plane.extent}
              xIdx={x}
              yIdx={y}
              key={x + ',' + y}
            />,
          );
        }
      }
    }

    let plane = this.state.plane && (
      <ARKit.Plane
        position={this.state.plane.node}
        shape={{
          width: this.state.plane.extent.x,
          height: this.state.plane.extent.z,
        }}
        eulerAngles={{ x: -Math.PI / 2, y: 0, z: 0 }}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          debug
          planeDetection
          lightEstimationEnabled
          worldAlignment={ARKit.ARWorldAlignment.Gravity}
          onPlaneDetected={this.planeDetection.bind(this)}
          onPlaneUpdate={this.planeDetection.bind(this)}
        >
          {/* <PongBall position={this.state.ballPosition} /> */}
          {this.state.plane && (
            <CrossHair
              planeCenter={this.state.plane.node}
              planeSize={this.state.plane.extent}
            />
          )}
          {plane}
          {bricks}
          {this.state.lasers}
          <ARKit.Light
            position={{ x: 1, y: 3, z: 2 }}
            type={ARKit.LightType.Omni}
            color="white"
          />
        </ARKit>
        <UI fireLaser={this.fireLaser.bind(this)} />
      </View>
    );
  }
}

AppRegistry.registerComponent('ar-pong', () => ReactNativeARKit);
