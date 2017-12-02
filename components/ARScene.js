import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import { ARKit } from 'react-native-arkit';
import PongBall from './PongBall';
import Brick from './Brick';
import CrossHair from './CrossHair';
import UI from './UI';
import Laser from './Laser';
import { connect } from 'react-redux';

import {
  addLaser,
  moveLasers,
  checkCollisions,
  initAliens,
} from '../actions/object';

class ARScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planes: null,
    };
  }

  componentDidMount() {
    intervalId = setInterval(this.globalStep.bind(this), 20);
    this.setState({
      intervalId: intervalId,
    });
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  globalStep() {
    this.props.moveLasers();
    this.props.checkCollisions();
  }

  planeDetection(plane) {
    this.setState({
      plane: plane,
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

    let lasers = [];
    this.props.lasers.forEach(laser => {
      lasers.push(
        <Laser
          position={laser.position}
          key={laser.startPosition.x + ',' + laser.startPosition.x}
        />,
      );
    });

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
          {lasers}
          <ARKit.Light
            position={{ x: 1, y: 3, z: 2 }}
            type={ARKit.LightType.Omni}
            color="white"
          />
        </ARKit>
        <UI fireLaser={this.props.fireLaser} style={styles.container} />
      </View>
    );
  }
}

const selectors = (state, ownProps) => ({
  lasers: state.objects.lasers,
});

const actions = dispatch => ({
  fireLaser: () => dispatch(addLaser()),
  moveLasers: () => dispatch(moveLasers()),
  initAliens: () => dispatch(initAliens()),
  checkCollisions: () => dispatch(checkCollisions()),
});

export default connect(selectors, actions)(ARScene);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});
