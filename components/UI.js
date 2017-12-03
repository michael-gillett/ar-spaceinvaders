import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ARKit } from 'react-native-arkit';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import { reset, nextRound } from '../actions/object';

class UI extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let paused = this.props.isPaused && (
      <View style={styles.container}>
        <Text style={styles.screenTitle}>{'YOU SURVIVED!'}</Text>
        <TouchableOpacity
          onPress={this.props.nextRound}
          style={styles.centerButton}
        >
          <Text style={styles.centerButtonText}>{'NEXT ROUND'}</Text>
        </TouchableOpacity>
      </View>
    );

    let gameOver = (this.props.isGameOver || !this.props.isInitd) && (
      <View style={styles.container}>
        {this.props.isInitd && (
          <Text style={styles.screenTitle}>{'GAME OVER!'}</Text>
        )}
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
      this.props.isInitd &&
      !this.props.isPaused && (
        <View style={styles.container}>
          <View style={styles.remaining}>
            <Text style={styles.remainingText}>{this.props.aliensLeft}</Text>
            <Text style={styles.remainingSubtext}>{'LEFT'}</Text>
          </View>
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
  aliensLeft: state.objects.aliens.length,
});

const actions = dispatch => ({
  reset: () => dispatch(reset()),
  nextRound: () => dispatch(nextRound()),
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
  screenTitle: {
    position: 'absolute',
    textAlign: 'center',
    top: 90,
    marginHorizontal: -3,
    left: 0,
    right: 0,
    fontSize: 40,
    color: '#4CAF50',
    fontWeight: 'bold',
    borderWidth: 3,
    borderColor: '#4CAF50',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  centerButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 2 - 25,
    left: Dimensions.get('window').width / 2 - 50,
    backgroundColor: '#4CAF50',
    width: 120,
    height: 50,
    borderRadius: 10,
  },
  remaining: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 90,
    height: 90,
    paddingTop: 25,
    borderBottomLeftRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
  },
  remainingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  remainingSubtext: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -3,
  },
  centerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: 'white',
  },
  fireLaser: {
    position: 'absolute',
    bottom: 60,
    left: Dimensions.get('window').width / 2 - 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    borderWidth: 10,
    borderColor: 'white',
    opacity: 0.7,
  },
  crosshair: {
    position: 'absolute',
    bottom: Dimensions.get('window').height / 2 + 8,
    left: Dimensions.get('window').width / 2 - 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    opacity: 0.7,
  },
});
