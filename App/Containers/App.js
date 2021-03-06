
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import '../I18n/I18n' // keep before root container
import RootContainer from './RootContainer'
import createStore from '../Redux'
import applyConfigSettings from '../Config'

import Parse from 'parse/react-native';
import SplashScreen from 'react-native-smart-splash-screen'
var WeChat=require('react-native-wechat');

// Apply config overrides
applyConfigSettings()
// create our store
const store = createStore()

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  componentWillMount() {
    SplashScreen.close(SplashScreen.animationType.fade, 850, 500)
    Parse.initialize("Mukapps", "Mukapps");
    Parse.serverURL = "http://5.9.227.199:1337/mukapps";

    WeChat.registerApp('wx1c8561be886ade37');
  }
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

export default App
