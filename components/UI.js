import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ARKit } from 'react-native-arkit';
import Dimensions from 'Dimensions';

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
        <TouchableOpacity style={styles.crosshair} />
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
    right: 125,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    opacity: 0.5,
  },
  crosshair: {
    position: 'absolute',
    bottom: Dimensions.get('window').width / 2 - 10,
    left: Dimensions.get('window').height / 2 - 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'black',
    opacity: 0.2,
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
