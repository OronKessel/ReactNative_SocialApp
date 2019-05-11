import React, {Component} from 'react';
import {Platform, Dimensions,FlatList,Linking,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import Drawer from 'react-native-drawer'
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../common/style';
import {serviceGetInbox} from '../api/message/message';
import {serviceRegisterDevice} from '../api/notification/push';
import {formatDate,getDay} from '../util/utils';
import DefaultPreference from 'react-native-default-preference';
var PushNotification = require('react-native-push-notification');

const { width, height } = Dimensions.get('window');

const { styles } = Styles;

var self= null;
export default class InboxScreen extends Component {
  constructor(props) {
    super(props);
    self = this;    
    const {state} = props.navigation;    
    this.state = {
        isVisibleSpin:false,
        isMaskShow:'none',
        maskPos:'relative',
        userInfo:state.params.userInfo,
        filterContacts:[],
        contacts:[],
        refreshing:false
    }    
  }
  webRegisterDeviceIOS(token)
  {
        serviceRegisterDevice(self.state.userInfo.id,'apn',token)
        .then(res=>{      
            //console.warn(res);
        })
        .catch(err=>{
            //console.warn(err);
        });
  }
  initPush()
  {
    PushNotification.setApplicationIconBadgeNumber(0);
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
          if (Platform.OS === 'ios')
          {
            self.webRegisterDeviceIOS(token.token)
          }
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          //console.warn( 'NOTIFICATION:', notification );

          PushNotification.getApplicationIconBadgeNumber((res)=>{
            //console.warn(res) //returns 10
            if (res != null)
              PushNotification.setApplicationIconBadgeNumber(res + 1)
            else 
              PushNotification.setApplicationIconBadgeNumber(1)
          });
          
          // process the notification
          // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
          //notification.finish(PushNotificationIOS.FetchResult.NoData);
          PushNotification.localNotification(
          {
            title: notification.message.title, // (o
            message: notification.message.body, // (required)
            playSound: false, // (optional) de
          });
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "YOUR GCM (OR FCM) SENDER ID",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
  });


    


  }
  componentDidMount()
  {      
      setTimeout(() => {
        this.setState({isVisibleSpin:true});      
        serviceGetInbox()
        .then(res=>{          
            if (res != null)
            {
              self.setState({isVisibleSpin:false,contacts:res,filterContacts:res});
              this.initPush();
            }
            else
            {
              self.setState({isVisibleSpin:false});
              this.initPush();
            }

            
        })
        .catch(err=>{
            self.setState({isVisibleSpin:false});            
            this.initPush();
        });
      }, 100);         
      
  }
  filterInbox(text)
  {
      var filters = [];
      if (text == '')
      {
          this.setState({filterContacts:this.state.contacts});
      }
      else
      {
          for (var i = 0;i < this.state.contacts.length;i++)
          {
              if (this.state.contacts[i].first_name.includes(text))
              {
                  filters.push(this.state.contacts[i])
                  continue;
              }
              if (this.state.contacts[i].last_name.includes(text))
              {
                  filters.push(this.state.contacts[i])
                  continue;
              }
          }
          this.setState({filterContacts:filters});
      }
  }
  renderSeparator()
  {
    return(
        <View style={{backgroundColor:'#323E49',height:1}}>
          
        </View>
      );
  }
  renderAddUnread(item)
  {
        if (item.unread > 0)
        {
            return (
                <View style={{backgroundColor:'#F44336',width:10,height:10,borderRadius:5,position:'absolute',marginLeft:40}}/>
            );
        }
  }

  

  spinnerStyle = function () {
    return {
      alignSelf:'center',
      justifyContent:'center',
      position:'absolute',
      top:0,
      bottom:0
    }
  }
  
  
  renderLoading = () => {
        if (this.state.isVisibleSpin) 
            return (
                <View style={this.spinnerStyle()}>
                    <Spinner visible={true}/>
                </View>
            );
        else
            return null;
    }
  getTimeString(receiveTime)
  {
    var date = new Date();
    var recDate = new Date(Date.parse(receiveTime));
    if (date.toDateString() == recDate.toDateString())
    {        
        return formatDate(recDate);
    }
    else if (date.getTime() - recDate.getTime() > 1000 * 3600 * 24 * 7)
    {
        currentDate = ("0" + (recDate.getMonth() + 1)).slice(-2) + "/" + ("0" + recDate.getDate()).slice(-2) + "/" + recDate.getFullYear();
        return currentDate;
    }
    else
    {
        return getDay(recDate);
        
    }
  }
  clickItem(item,index)
  {
    this.props.navigation.navigate('ConversationScreen',{athlet:item,userInfo:self.state.userInfo});
  }
  renderInboxItem(item,index)
  {   
      var backColor = "#263440";   
      if (index % 2 == 1)
      {
          backColor = '#25313C';
      }      
      return(
        <TouchableOpacity onPress={()=>this.clickItem(item,index)}>
            <View>            
                <View style={{backgroundColor:backColor,flexDirection:'row',alignItems:'center',padding:10}}>                
                    <View>
                        <Image style={[styles.img50,{borderRadius:25}]} source={{uri:item.profile_image}}/>
                        {this.renderAddUnread(item)}                    
                    </View>                
                    <View style={{marginLeft:10,flex:1}}>
                        <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                            <Text style={[styles.whiteColor,{fontSize:14}]}>{item.first_name} {item.last_name}</Text>
                            <Image style={{width:18,height:15,marginLeft:10}} source={require('../assets/ic_msg.png')}/>
                            {
                              width < 350?
                                <Text style={{color:'#2491C9',fontSize:12,textAlign:'right',flex:1}}>{this.getTimeString(item.last_received_time).substring(0,3)}</Text>                                
                                :
                                <Text style={{color:'#2491C9',fontSize:12,textAlign:'right',flex:1}}>{this.getTimeString(item.last_received_time)}</Text>

                            }                            
                        </View>
                        <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                            <Text style={{color:'#8F969C',fontSize:12}}>{item.last_message_preview}</Text>                        
                        </View>
                    </View>
                </View>
                <View style={{backgroundColor:'#323E49',height:1}}></View>            
            </View>        
        </TouchableOpacity>
      );
  }
  handleRefresh()
  {
        self.setState({refreshing:true});
        serviceGetInbox()
        .then(res=>{
            self.setState({refreshing:false,contacts:res,filterContacts:res});
        })
        .catch(err=>{
            self.setState({refreshing:false});            
        });
  }
  renderInbox()
  {      
      if (this.state.contacts.length == 0)
      {
        return (
            <View style={{flex:1}}>
                <Text style={{color:'#fff',margin:20,textAlign:'center',fontSize:16}}>You have no message in your inbox. Compose a new message by selecting the plus sign below</Text>
            </View>
        );
      }
      else
      {
        return(
            <FlatList              
              data={this.state.filterContacts}
              renderItem={({item,index}) => this.renderInboxItem(item,index)}
              keyExtractor={(item, index) => index.toString()}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
        )
      }
  }
  clickFaq()
  {
    Linking.canOpenURL("http://www.stackedsports.com/faq").then(supported => {
        if (supported) {
          Linking.openURL("http://www.stackedsports.com/faq");
        }
    });
  }
  renderSms()
  {
      if (this.state.userInfo.sms_number != null && this.state.userInfo.sms_number != "")
      {
        return(
            <View style={{backgroundColor:'#273440',flexDirection:'row',padding:10,alignItems:'center'}}>
                <Image style={[styles.img15,{marginLeft:10}]} source={require('../assets/phone-green-512.png')}/>                
                <Text style={[styles.whiteColor,{fontSize:16,flex:1,marginLeft:10}]}>{this.state.userInfo.sms_number}</Text>                   
            </View>
        )
      }
      else{
        
      }
  }
  renderMenu()
  {
      return(
        <View style={{backgroundColor:'#25313C',flex:1}}>
            <View style={{backgroundColor:'#273440',flexDirection:'row',paddingTop:45,paddingLeft:10,paddingRight:10,paddingBottom:10}}>
                <Image style={[styles.img50,{borderRadius:25}]} source={{uri: this.state.userInfo.twitter_profile.profile_image}}/>
                <View style={{margin:10}}>
                    <Text style={[styles.whiteColor,{fontSize:16}]}>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</Text>   
                    <Text style={[styles.grayColor,{fontSize:16}]}>Last Login:{this.state.userInfo.last_login_at.substring(0, 10)}</Text>
                </View>                
            </View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <View style={{backgroundColor:'#323E49',height:1,marginTop:30}}></View>
            <TouchableOpacity onPress={()=> this.clickPushSetting()}>
                <View style={{backgroundColor:'#273440',flexDirection:'row',padding:10,alignItems:'center'}}>
                    <Text style={[styles.whiteColor,{fontSize:16,flex:1}]}>Push Notifications</Text>   
                    <Image style={[styles.img15,{marginRight:10}]} source={require('../assets/gt-512.png')}/>                
                </View>
            </TouchableOpacity>            
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <TouchableOpacity>
                <View style={{backgroundColor:'#273440',flexDirection:'row',padding:10,alignItems:'center'}}>
                    <Text style={[styles.whiteColor,{fontSize:16,flex:1}]} onPress={()=> this.clickFaq()}>FAQ</Text>   
                    <Image style={[styles.img15,{marginRight:10}]} source={require('../assets/gt-512.png')}/>                
                </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <View style={{backgroundColor:'#273440',flexDirection:'row',height:100,padding:10,alignItems:'center'}}></View>
            <View style={{backgroundColor:'#323E49',height:1,marginTop:30}}></View>
            <View style={{backgroundColor:'#273440',flexDirection:'row',padding:10,alignItems:'center'}}>
                <Image style={[styles.img15,{marginLeft:10}]} source={require('../assets/twitter-512.png')}/>                
                <Text style={[styles.whiteColor,{fontSize:16,flex:1,marginLeft:10}]}>{this.state.userInfo.twitter_profile.screen_name}</Text>                   
            </View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            {this.renderSms()}
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <View style={{backgroundColor:'#273440',flexDirection:'row',height:100,padding:10,alignItems:'center'}}></View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <TouchableOpacity onPress={()=>this.clickLogout()}>
                <View style={{backgroundColor:'#273440',flexDirection:'row',padding:10,alignItems:'center'}}>
                    <Text style={{fontSize:16,flex:1,textAlign:'center',color:'#EE4236'}}>Sign Out</Text>                   
                </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#323E49',height:1}}></View>            
        </View>
      );
  }
  clickLogout()
  {
      DefaultPreference.clearMultiple(['user','password']).then(function() 
      {        
        self.props.navigation.navigate('LoginScreen');
      })
      .catch(err=>{            

      });
  }
  clickPushSetting()
  {
    this.closeControlPanel();
    this.props.navigation.navigate('NotificationScreen')
  }
  closeControlPanel = () => {
    this._drawer.close()
    this.setState({isMaskShow:'none',maskPos:'relative'});
  };
  openControlPanel = () => {
    this._drawer.open()
    this.setState({isMaskShow:'flex',maskPos:'absolute'});
  };
  goQueueScreen()
  {    
      setTimeout(() => {
        this.props.navigation.navigate('QueueScreen',{userInfo:this.state.userInfo});
      }, 100); 
      
  }
  render() {
    const drawerStyles = {
        drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
        main: {paddingLeft: 3},
    }
    return (
      <Drawer        
        onClose={() => this.setState({isMaskShow:'none',maskPos:'relative'})}
        ref={(ref) => this._drawer = ref}
        tapToClose={true}
        openDrawerOffset={80}        
        content={this.renderMenu()}
        type="overlay"
        style={drawerStyles}        
        >
        <StatusBar hidden={true} />
        <View style={[styles.bg,styles.flexFull]}>        
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=> this.openControlPanel()}>
                        <Image style={[styles.img15]} source={require('../assets/menu-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:20}]}>
                    <TouchableOpacity>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>All Messages</Text>                            
                        </View>
                    </TouchableOpacity>
                </View>                
                <View style={{flex:1,alignItems:'flex-end'}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=> this.props.navigation.navigate('QueueScreen',{userInfo:self.state.userInfo})}>
                        <Image style={[styles.img15]} source={require('../assets/pending-512.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
            <TextInput style={styles.inputSearch} placeholder="Search" placeholderTextColor="#8D9196" onChangeText={(text) => this.filterInbox(text)}/>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            {this.renderInbox()}            
            <View style={{alignItems:'flex-end'}}>
                <TouchableOpacity style={{marginRight:20,marginBottom:20}} onPress={()=> this.props.navigation.navigate('MessageScreen',{userInfo:self.state.userInfo,onGoBack: () => this.goQueueScreen()})}>
                    <Image style={[styles.img50,{marginLeft:5}]} source={require('../assets/ic_add_circle.png')}/>                      
                </TouchableOpacity>
            </View>
            <View style={[styles.fullWidthHeight,{display:this.state.isMaskShow,position:this.state.maskPos,backgroundColor:'#000000',opacity:0.5}]}>
                
            </View>
            {this.renderLoading()}
        </View>
      </Drawer>
      
    );
  }
}