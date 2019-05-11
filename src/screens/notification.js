import React, {Component} from 'react';
import {Platform, CheckBox,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../common/style';
import DefaultPreference from 'react-native-default-preference';
import Permissions from 'react-native-permissions'
var PushNotification = require('react-native-push-notification');

const { styles } = Styles;

var self= null;
export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = {
        isPush:"1",
        isVisibleSpin:false,
    }
    
  }
  componentDidMount()
  {       
    
    DefaultPreference.get('push').then(function(value) 
    {
        
        if (value == null)
        {
            Permissions.check('notification', { type: ['alert', 'badge'] }).then(response => {
                if (response == "authorized")
                {
                    self.setState({isPush:"1"});
                }
                else
                {
                    self.setState({isPush:"0"});
                }                
            });            
        }
        else
        {                
            self.setState({isPush:value});
        }
    })
    .catch(err=>{            

    });
  } 
  
  clickEnablePush()
  {
    var enable = this.state.isPush;
    if (enable == "0")
    {
        enable = "1";
        PushNotification.requestPermissions() ;
    }
    else 
    {
        enable = "0";
        PushNotification.abandonPermissions() ;
    }
    this.setState({isPush:enable});    
    DefaultPreference.set('push',enable).then(function(value) 
    {       
            
    });
  }
  render() {    
    return (
        <View style={[styles.bg,styles.flexFull]}>
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=> this.props.navigation.goBack()}>
                        <Image style={[styles.img15]} source={require('../assets/x-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:20}]}>                    
                    <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                        <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>Push Notifications</Text>                            
                    </View>                    
                </View>                
            </View>
            <View>
                <Text style={{color:'#82898F',margin:20,textAlign:'center',fontSize:16}}>You will receive a push notification when the following activities occur.</Text>
            </View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <TouchableOpacity onPress={() => { this.clickEnablePush() }}>
                <View style={{backgroundColor:'#273440',flexDirection:'row',padding:10,alignItems:'center'}}>
                    <Text style={[styles.whiteColor,{fontSize:16,flex:1}]}>New Messages Received</Text>
                    {
                        this.state.isPush == "1"?
                        <Image style={{marginRight:10,width:33,height:20}} source={require('../assets/switch-on.png')}/>:
                        <Image style={{marginRight:10,width:33,height:20}} source={require('../assets/switch-off.png')}/>
                    }
                    
                </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            
            <Spinner
            visible={this.state.isVisibleSpin}
            />
        </View>      
    );
  }
}