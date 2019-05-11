/**
 * BuzzBus React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, ScrollView
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
import LoginScreen from './src/screens/login';
import InboxScreen from './src/screens/inbox';
import NotificationScreen from './src/screens/notification';
import MessageScreen from './src/screens/message';
import ConversationScreen from './src/screens/conversation';
import BoardlistScreen from './src/screens/boardlist';
import QueueScreen from './src/screens/queue';
import QueueDetailScreen from './src/screens/queuedetail';
import EditMessageScreen from './src/screens/editmessage';
import MediaLibraryScreen from './src/screens/medialibrary';
import SplashScreen from './src/screens/splash';
import RecipientScreen from './src/screens/recipients';

import { setCustomText } from 'react-native-global-props';

const customTextProps = {
    style: {
      fontFamily: "Helvetica Neue"
    }
};
setCustomText(customTextProps);
// global.__DEV__=false;
const Routes = StackNavigator({
    SplashScreen: {screen:SplashScreen, navigationOptions:{header:true,gesturesEnabled: false}},    
    LoginScreen: {screen:LoginScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    InboxScreen: {screen:InboxScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    NotificationScreen: {screen:NotificationScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    MessageScreen: {screen:MessageScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    ConversationScreen: {screen:ConversationScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    BoardlistScreen: {screen:BoardlistScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    QueueScreen: {screen:QueueScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    QueueDetailScreen: {screen:QueueDetailScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    EditMessageScreen: {screen:EditMessageScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    RecipientScreen: {screen:RecipientScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    MediaLibraryScreen: {screen:MediaLibraryScreen, navigationOptions:{header:true,gesturesEnabled: false}},
    
    //WriteFeedbackScreen: {screen:WriteFeedbackScreen, navigationOptions:{header:true}},


})
//TrackPlayer.registerEventHandler(require('./src/components/RemoteControlHandler.js'));
AppRegistry.registerComponent('RecruitSuite', () =>  Routes);
console.disableYellowBox = false;
