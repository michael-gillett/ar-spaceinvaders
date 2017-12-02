import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import ARScene from './components/ARScene';

import store from './store/appStore';
import { Provider } from 'react-redux';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <ARScene />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ar-pong', () => App);
