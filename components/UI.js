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
          style={styles.fireLaser}
        />
      </View>
    );
  }
}

export default UI;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  fireLaser: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'green',
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    backgroundColor: 'white',
  },
});
