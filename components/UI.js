import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ARKit } from 'react-native-arkit';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import { reset } from '../actions/object';

class UI extends Component {
  constructor(props) {
    super(props);
  }

  resetAR() {
    ARKit.reset();
  }

  render() {
    let paused = this.props.isPaused && (
      <TouchableOpacity onPress={this.props.reset} style={styles.centerButton}>
        <Text style={styles.centerButtonText}>
          {this.props.init ? 'START' : 'RESTART'}
        </Text>
      </TouchableOpacity>
    );

    let gameOver = (this.props.isGameOver || !this.props.isInitd) && (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.props.reset}
          style={styles.centerButton}
        >
          <Text style={styles.centerButtonText}>
            {this.props.isInitd ? 'RESTART' : 'START'}
          </Text>
        </TouchableOpacity>
      </View>
    );

    let inGame = !this.props.isGameOver &&
      this.props.isInitd && (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.resetAR} style={styles.resetButton}>
            <Text> Reset </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.crosshair} />
          <TouchableOpacity
            onPress={this.props.fireLaser}
            style={styles.fireLaser}
          />
        </View>
      );

    return (
      <View style={styles.container}>
        {paused}
        {gameOver}
        {inGame}
      </View>
    );
  }
}

const selectors = (state, ownProps) => ({
  isGameOver: state.objects.isGameOver,
  isInitd: state.objects.isInitd,
  isPaused: state.objects.isPaused,
});

const actions = dispatch => ({
  reset: () => dispatch(reset()),
  moveLasers: () => dispatch(moveLasers()),
});

export default connect(selectors, actions)(UI);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  centerButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 2 - 25,
    left: Dimensions.get('window').width / 2 - 50,
    backgroundColor: '#607D8B',
    width: 120,
    height: 50,
    borderRadius: 10,
  },
  centerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: 'white',
  },
  fireLaser: {
    position: 'absolute',
    bottom: 50,
    right: 125,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    opacity: 0.5,
  },
  crosshair: {
    position: 'absolute',
    bottom: Dimensions.get('window').height / 2 - 10,
    left: Dimensions.get('window').width / 2 - 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'yellow',
    opacity: 0.3,
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 50,
    height: 50,
    backgroundColor: 'white',
  },
});
