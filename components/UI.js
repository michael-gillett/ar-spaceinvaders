import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ARKit } from 'react-native-arkit';

class UI extends Component {
  constructor(props) {
    super(props);
  }

  resetAR() {
    ARKit.reset();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.resetAR} style={styles.resetButton}>
          <Text> Reset </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.fireLaser}
          style={styles.resetButton}
        >
          <Text> Fire </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default UI;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  fireLaser: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'green',
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
  },
});
