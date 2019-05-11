import React, {Component} from 'react';
import {Platform, CheckBox,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import Spinner from 'react-native-loading-spinner-overlay';
import Permissions from 'react-native-permissions'
import {Config} from '../doc/config';
import DefaultPreference from 'react-native-default-preference';

import Styles from '../common/style';
import {serviceLogin} from '../api/organization/user';

const { styles } = Styles;

var self= null;
export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    var timer;
    self = this;
    this.state = {     
      
    }

  }
  componentDidMount()
  {      
        DefaultPreference.getMultiple(['user','password']).then(function(values) 
        {
            if (values[0] == null)
            {
                this.goLogin();
            }
            else
            {
                self.doLogin(values[0],values[1]);
            }
        })
        .catch(err=>{            
            this.goLogin();        
        });
  }
  doLogin(user,pw)
  {
    serviceLogin(user,pw)
    .then(res=>{      
      Config.AuthToken = res.token;
      this.props.navigation.navigate('InboxScreen',{userInfo:res});
    })
    .catch(err=>{
        this.goLogin();        
    });
  }
  goLogin()
  {
    setTimeout(() => {
        this.props.navigation.navigate('LoginScreen');        
    }, 2000);     
  }
  render() {
    return (
      <View style={[styles.bg,styles.flexFull]}>
        <StatusBar hidden={true} />
        <Image style={[styles.bgImage,{position:'absolute'}]} source={require('../assets/login-background.png')}/>
        <View style={styles.vwLoginFrame}>
            <Image style={styles.loginLogo} resizeMode='stretch' source={require('../assets/login_logo.png')}/>
        </View>        
      </View>
    );
  }
}
