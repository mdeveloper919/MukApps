import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import { Actions as NavigationActions } from 'react-native-router-flux'

// screens identified by the router
import BaiduMapScreen from '../Containers/BaiduMapScreen'
import AboutScreen from '../Containers/AboutScreen'
import CategoryScreen from '../Containers/CategoryScreen'
import ShareScreen from '../Containers/ShareScreen'
import I18n from 'react-native-i18n'

import * as WeChat from 'react-native-wechat';

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  PressShare = () => {
  //  this.toggleDrawer()
  //  NavigationActions.ShareScreen()
    WeChat.isWXAppInstalled()
      .then((isInstalled) => {
        if (isInstalled) {
          WeChat.shareToTimeline({
            title:I18n.t('yourlocation'),
            description: 'Display your location on baidu map.',
            thumbImage: 'http://cdn.windows7themes.net/pics/baidu-logo.png',
            type: 'news',
            webpageUrl: 'http://map.baidu.com/mobile/webapp/index/index/foo=bar/vt=map/?fromhash=1'
          })
          .catch((error) => {
            window.alert(error.message);
          });
        } else {
          window.alert(I18n.t('wechatalert'));
        }
      });
  }
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene initial key='BaiduMapScreen' component={BaiduMapScreen} title={I18n.t('maps')} rightTitle={I18n.t('share')} onRight={this.PressShare} renderLeftButton={NavItems.hamburgerButton} />
            <Scene key='CategoryScreen' component={CategoryScreen} title={I18n.t('category')} />
            <Scene key='AboutScreen' component={AboutScreen} title={I18n.t('aboutmukapps')} />
            <Scene key='ShareScreen' component={ShareScreen} title={I18n.t('share')} />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
