import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import { ARKit, withProjectedPosition } from 'react-native-arkit';
import Alien from './Alien';
import CrossHair from './CrossHair';
import UI from './UI';
import Laser from './Laser';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

import {
  addLaser,
  moveLasers,
  checkCollisions,
  initAliens,
  moveAliens,
  updateCursorPos,
  checkDistance,
} from '../actions/object';

const Cursor3D = withProjectedPosition()(
  ({ positionProjected, projectionResult }) => {
    if (!projectionResult) {
      // nothing has been hit, don't render it
      return null;
    }
    return (
      <ARKit.Sphere
        position={positionProjected}
        transition={{ duration: 0.1 }}
        shape={{
          radius: 0.005,
        }}
        material={{
          color: 'white',
        }}
      />
    );
  },
);

class ARScene extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    intervalId = setInterval(this.globalStep.bind(this), 15);
    this.setState({
      intervalId: intervalId,
    });
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  globalStep() {
    if (!this.props.shouldStop) {
      this.props.moveLasers();
      this.props.moveAliens();
      this.props.checkCollisions();
    }
  }

  render() {
    let aliens = [];
    this.props.aliens.forEach(alien => {
      aliens.push(
        <Alien
          position={alien.position}
          rotation={alien.rotation}
          shape={alien.shape}
          key={alien.i}
          id={'alien_' + alien.i}
        />,
      );
    });

    let lasers = [];
    this.props.lasers.forEach(laser => {
      lasers.push(
        <Laser
          position={laser.position}
          key={laser.startPosition.x + ',' + laser.startPosition.x}
        />,
      );
    });

    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          debug
          // planeDetection
          lightEstimationEnabled
          worldAlignment={ARKit.ARWorldAlignment.Gravity}
          // onPlaneDetected={this.planeDetection.bind(this)}
          // onPlaneUpdate={this.planeDetection.bind(this)}
        >
          <Cursor3D
            projectPosition={{
              x: Dimensions.get('window').width / 2,
              y: Dimensions.get('window').height / 2,
              node: results => results.find(r => r.id.startsWith('alien_')),
            }}
            onProjectedPosition={result => {
              if (result) {
                this.props.updateCursorPos(result.point);
              }
            }}
          />
          {aliens}
          {lasers}
          <ARKit.Light
            position={{ x: 0, y: 0, z: 0 }}
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
  aliens: state.objects.aliens,
  shouldStop:
    state.objects.isGameOver ||
    !state.objects.isInitd ||
    state.objects.isPaused,
});

const actions = dispatch => ({
  fireLaser: () => dispatch(addLaser()),
  moveLasers: () => dispatch(moveLasers()),
  moveAliens: () => dispatch(moveAliens()),
  initAliens: (center, extent) => dispatch(initAliens(center, extent)),
  checkCollisions: () => dispatch(checkCollisions()),
  checkDistance: () => dispatch(checkDistance()),
  updateCursorPos: pos => dispatch(updateCursorPos(pos)),
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
