import React, {Component} from 'react';
import {KeyboardAvoidingView,Keyboard,Platform, FlatList,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import Drawer from 'react-native-drawer';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import { Calendar } from 'react-native-calendars';
import CheckBox from 'react-native-check-box'
//if (Platform.OS === 'android')
import Picker from 'react-native-wheel-picker'
var PickerItem = Picker.Item;
//import {Picker} from 'react-native'
import Styles from '../common/style';
import {serviceGetConversation,serviceCreateSms,serviceCreateDM} from '../api/message/message';
import {serviceCreateMedia} from '../api/media/media';
import {getFormattedDate,validateTime,validateDate} from '../util/utils';


const { styles } = Styles;

var self= null;
export default class ConversationScreen extends Component {
  constructor(props) {
    var flatMessage;
    var inputMessage;
    var timer;
    var dlgImagePicker;
    super(props);
    self = this;  
    const {state} = props.navigation;    
    date = new Date();
    currentDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    this.state = {
        athInfo:state.params.athlet,
        userInfo:state.params.userInfo,
        messages:[],
        refreshing:false,
        athImage:"",
        message:"",
        isMostActive:false,
        isAsap:false,
        selectedDate:currentDate,
        hours:["1"],
        minutes:["1"],
        timezone:["AM","PM"],        
        selectYear:"2019",
        selectHour:0,
        selectMin:0,
        selectZone:0,
        isOpenTimePicker:false,
        mediaUri:"",
        mediaId:'',
        sendat:'',
        sendmode:'',
        platform:'',
        recipient:''
    }    
  }
  componentWillUnmount()
  {    
    clearInterval(timer);   
    //clearInterval(timerScroll); 
  }
  initTime()
  {
    var vHours = [];
    var vMinutes = [];    
    for (i = 0;i < 13;i++)
    {
        var hour = "0" + i.toString();
        var hour = hour.substring(hour.length - 2,hour.length);        
        vHours.push(hour);
    }
    for (i = 0;i < 60;i++)
    {
        var minute = "0" + i.toString();
        vMinutes.push(minute.substring(minute.length - 2,minute.length))
    }
    var date = new Date();    
    hour = date.getHours();        
    min = date.getMinutes();
    zone = 0;
    if (hour > 12) 
    {
        hour = hour - 12;
        zone = 1;
    }
    else if (hour < 0) hour = hour + 12;
    self.setState({hours:vHours,minutes:vMinutes});
    self.setState({selectHour:hour,selectZone:zone,selectMin:min});
  }
  componentDidMount()
  {    
    this.getMessage();
    timer = setInterval(this.getMessage, 30000);
    //timerScroll = setInterval(this.scrollEnd, 1000);     
  }
  scrollEnd()
  {
      self.flatMessage.scrollToEnd();
  }
  getMessage()
  {    
    serviceGetConversation(self.state.athInfo.team_athlete_id)
      .then(res=>{          
          self.setState({athImage:res.athlete_profile_image,messages:res.messages,refreshing:false});                    
          setTimeout(() => {
            self.flatMessage.scrollToEnd();    
          }, 200);
      })
      .catch(err=>{
          
      });
  }
  renderMessageType(item)
  {
      if (item.message_type == "sms")
      {
          return(
            <View style={{position:'absolute',right:-10,top:-10,alignItems:'center',justifyContent:'center',backgroundColor:'#7ED321',width:20,height:20,borderRadius:10}}>
                <Image style={{width:12,height:10}} source={require('../assets/ic_msg_white.png')}></Image>
            </View>
          );
      }
      else
      {
          return(
            <View style={{position:'absolute',right:-10,top:-10,alignItems:'center',justifyContent:'center',backgroundColor:'#2491C9',width:20,height:20,borderRadius:10}}>
                <Image style={{width:10,height:10}} source={require('../assets/twitter-white-512.png')}></Image>
            </View>
          );
      }
  }
  renderMediaItem(item)
  {
     var backColor = "#EFEFEF";
     if (item.direction == "out")
     {
        backColor = '#2491C9';
        if (Array.isArray(item.media) && item.media.length >0) 
        {            
            return (
                item.media.map((value,index) => (
                    <View key={"img_out" + index} style={{flexDirection:'row',alignItems:'flex-end',padding:10}}>
                        <View style={{flex:1,justifyContent: 'flex-end', flexDirection: 'row',marginRight:10,marginLeft:10}}>
                            <View style={{marginLeft:10,backgroundColor:backColor,padding:10}}>
                                <Image key={"img_out_back_img" + index} source={{uri:value}} style={{width:180,height:140}}/>                        
                                {this.renderMessageType(item)}
                            </View>                        
                        </View>
                    </View>               
                ))
            );
        }
        else if (item.media.id != undefined)
        {
            return (
                <View key={"img_out" + item.media.id} style={{flexDirection:'row',alignItems:'flex-end',padding:10}}>
                    <View style={{flex:1,justifyContent: 'flex-end', flexDirection: 'row',marginRight:10,marginLeft:10}}>
                        <View style={{marginLeft:10,backgroundColor:backColor,padding:10}}>
                        <Image key={"img_out_back_img" + item.media.id} source={{uri:item.media.urls.medium}} style={{width:180,height:140}}/>                        
                    {this.renderMessageType(item)}
                        </View>                        
                    </View>
                </View>
            );
         }
     }
     else
     {
         if (Array.isArray(item.media) && item.media.length > 0)
         {
            return (
                item.media.map((value,index) => (
                    <View key={"img_in" + index} style={{flex:1,justifyContent: 'flex-start', flexDirection: 'row',marginRight:30,marginTop:10}}>
                        <View style={{marginLeft:10,backgroundColor:backColor,padding:10}}>
                            <Image key={"img_in_back_img" + index} source={{uri:value}} style={{width:180,height:140}}/>                        
                            {this.renderMessageType(item)}
                        </View>                                
                    </View>
                ))
            );
         }
         else if (item.media.id != undefined)
         {
            return (
                <View key={"img_in" + item.media.id} style={{flex:1,justifyContent: 'flex-start', flexDirection: 'row',marginRight:30,marginTop:10}}>
                    <View style={{marginLeft:10,backgroundColor:backColor,padding:10}}>
                        <Image key={"img_in_back_img" + item.media.id} source={{uri:item.media.urls.medium}} style={{width:180,height:140}}/>                        
                        {this.renderMessageType(item)}
                    </View>                                
                </View>
            );
         }
     }
  }
  removeAttach()
  {
      self.setState({mediaUri:""});
  }
  renderAttachMedia()
  {
      if (this.state.mediaUri != "")
      {
          return (
            <View style={{flexDirection:'row',height:110,backgroundColor:'#1B242D'}}>
                <Image source={{uri:this.state.mediaUri}} style={{marginLeft:10,marginTop:10,width:120,height:100}}/>
                <TouchableOpacity style={{position:'absolute',left:107,top:15}} onPress={() => { this.removeAttach() }}>
                    <Image source={require('../assets/x-512.png')} style={{width:13,height:13}}/>
                </TouchableOpacity>
            </View>
          );
      }
  }
  renderMessageItem(item,index)
  {   
      var backColor = "#EFEFEF";   
      var textColor = "#5E5F5E";
      if (item.direction == "out")
      {
          backColor = '#2491C9';
          textColor = '#fff';
          return(        
            <View>                            
                {
                    item.text != "" ? 
                    <View style={{flexDirection:'row',alignItems:'flex-end',padding:10}}>
                        <View style={{flex:1,justifyContent: 'flex-end', flexDirection: 'row',marginRight:10,marginLeft:10}}>
                            <View style={{marginLeft:10,backgroundColor:backColor,padding:10}}>
                                <Text style={{color:textColor,fontSize:16}}>{item.text}</Text>
                                {/* <Text style={{color:textColor,fontSize:16}}>This is dummy text</Text> */}
                                {this.renderMessageType(item)}
                            </View>                        
                        </View>
                    </View>
                    :null
                }                
                {this.renderMediaItem(item)}
            </View>
        );
      }
      else
      {
        return(        
                <View>            
                    <View style={{flexDirection:'row',alignItems:'flex-end',padding:10}}>                
                        <View>
                            <Image style={[styles.img50,{borderRadius:25}]} source={{uri:this.state.athImage}}/>                        
                        </View>
                        <View>
                            {
                                item.text != "" ? 
                                <View style={{flex:1,justifyContent: 'flex-start', flexDirection: 'row',marginRight:30}}>
                                    <View style={{marginLeft:10,backgroundColor:backColor,padding:10}}>
                                        <Text style={{color:textColor,fontSize:16}}>{item.text}</Text>
                                        {/* <Text style={{color:textColor,fontSize:16}}>This is dummy text. After test, will be back to original. Huh... thanks</Text> */}
                                        {this.renderMessageType(item)}
                                    </View>                                
                                </View>
                                :null
                            }                            
                            {this.renderMediaItem(item)}
                        </View>
                    </View>                
                </View>
        );
      }
  }
  handleRefresh()
  {
    self.setState({refreshing:true});
    self.getMessage();
  }

  sendMessage()
  {
    var messages = this.state.messages;
    if (this.state.message == "") return;
    var message = {};      
    message.text = this.state.message;    
    this.inputMessage.clear();
    
    var recip = this.state.athInfo.team_athlete_id + "::::";
    var timestamp = "";
    var pickerDate = new Date(Date.parse(self.state.selectedDate));
    if (this.state.timezone[this.state.selectZone] == "AM")
    {
        pickerDate.setHours(this.state.selectHour);
        pickerDate.setMinutes(this.state.selectMin);        
    }
    else
    {
        pickerDate.setHours(this.state.selectHour + 12);
        pickerDate.setMinutes(this.state.selectMin);        
    }
    
    var send_at = pickerDate.toISOString();
    if (this.state.isAsap)
    {
        date = new Date();
        send_at = date.toISOString();        
    }
    var platform = 'SMS'
    if (this.state.mediaUri == '')
        {        
            this.webSendSms(this.state.message,recip,send_at,'',platform);
        }
        else
        {
            if (this.state.mediaId == '')
                this.webCreateMedia(this.state.message,recip,send_at,platform);
            else
                this.webSendSms(this.state.message,recip,send_at,this.state.mediaId,platform);
        }    
  }
  webCreateMedia(message,recip,sendat,platform)
  {
      var mediaInfo = {};
      mediaInfo.owner = this.state.userInfo.id;
      mediaInfo.group = this.state.userInfo.team.id;
      mediaInfo.token = this.state.userInfo.twitter_profile.token;
      mediaInfo.secret = this.state.userInfo.twitter_profile.secret;      
      mediaInfo.uri = this.state.mediaUri;
      this.setState({mediaUri:''});
      serviceCreateMedia(mediaInfo)
        .then(res=>{
            //this.setState({mediaUri:''});
            console.warn(res);
            this.webSendSms(message,recip,sendat,res.id.toString(),platform)
        })
        .catch(err=>{
      });    
  }
  webSendSms(message,recip,sendat,mediaId,platform)
  {
      if (platform == 'SMS')
      {        
        serviceCreateSms(message,recip,sendat,mediaId,platform)
        .then(res=>{
            console.warn(res);
            this.setState({mediaUri:'',mediaId:''});
        })
        .catch(err=>{
            console.warn(err);
            this.setState({mediaUri:'',mediaId:''});
        });    
    }
    else
    {
        serviceCreateDM(message,recip,sendat,mediaId,platform)
        .then(res=>{
            console.warn(res);
            this.setState({mediaUri:'',mediaId:''});
        })
        .catch(err=>{
            console.warn(err);
            this.setState({mediaUri:'',mediaId:''});
        });
    }
  }

  sendTwitter()
  {
    var messages = this.state.messages;
    if (this.state.message == "") return;
    var message = {};      
    message.text = this.state.message;    
    this.inputMessage.clear();
    
    var recip = this.state.athInfo.team_athlete_id + "::::";
    var timestamp = "";
    var pickerDate = new Date(Date.parse(self.state.selectedDate));
    if (this.state.timezone[this.state.selectZone] == "AM")
    {
        pickerDate.setHours(this.state.selectHour);
        pickerDate.setMinutes(this.state.selectMin);        
    }
    else
    {
        pickerDate.setHours(this.state.selectHour + 12);
        pickerDate.setMinutes(this.state.selectMin);        
    }
    
    var send_at = pickerDate.toISOString();
    if (this.state.isAsap)
    {
        date = new Date();
        send_at = date.toISOString();        
    }    
    var platform = 'Twitter'
    if (this.state.mediaUri == '')
    {        
        this.webSendSms(this.state.message,recip,send_at,'',platform);
    }
    else
    {
        if (this.state.mediaId == '')
            this.webCreateMedia(this.state.message,recip,send_at,platform);
        else
            this.webSendSms(this.state.message,recip,send_at,this.state.mediaId,platform);
    }
  }
  callbackMediaLib(info)
  {      
      self.setState({mediaId:info.id,mediaUri:info.urls.medium});
  }
  clickPickerSelect(index)
  {    
      const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,            
            storageOptions: {
            skipBackup: true,
            },
      };
      if (index == 0)
      {
        this.props.navigation.navigate('MediaLibraryScreen',{onMediaSelect: (info) => this.callbackMediaLib(info)});
      }
      else if (index == 1)
      {         
        ImagePicker.launchImageLibrary(options, (response) => {
            //console.warn(response.uri);
            self.setState({mediaUri:response.uri});
            // Same code as in above section!
        }); 
      }
      else if (index == 2)
      {
        ImagePicker.launchCamera(options, (response) => {
            self.setState({mediaUri:response.uri});
            // Same code as in above section!
        });          
      }      
  }
  onHourPicker (index) {
        if (validateDate(this.state.selectedDate) == 0)
        {
            this.setState({
                selectHour: index,
            })
        }
        else if (validateDate(this.state.selectedDate) == 1)
        {            
            if (validateTime(index,this.state.selectMin,this.state.selectZone))
            {
                this.setState({
                    selectHour: index,
                })
            }
            else
            {
            }
        }   
  }
  onMinutePicker(index){
    if (validateDate(this.state.selectedDate) == 0)
    {
        this.setState({
            selectMin: index,
        })
    }
    else if (validateDate(this.state.selectedDate) == 1)
    {
        if (validateTime(this.state.selectHour,index,this.state.selectZone))
        {
            this.setState({
                selectMin: index,
            })
        }
    }   
    
    
  }  
  onZonePicker(index)
  {
    if (validateDate(this.state.selectedDate) == 0)
    {
        this.setState({
            selectZone: index,
        })
    }
    else if (validateDate(this.state.selectedDate) == 1)
    {
        if (validateTime(this.state.selectHour,this.state.selectMin,index))
        {
            this.setState({
                selectZone: index,
            })
        }  
    }   
      
  }
    
  getFormatDatetime()
  {   
      dateString = getFormattedDate(self.state.selectedDate);      
      if (this.state.hours.length > 0)
        dateString = dateString + " " + this.state.hours[this.state.selectHour] + ":" + this.state.minutes[this.state.selectMin] + " " + this.state.timezone[this.state.selectZone] 
      else
      {
          date = new Date();
          dateString = dateString + " " + date.getHours() + ":" +date.getMinutes();
      }
      return dateString;     
  }
  clickSetTime()
  {
    this.setState({isOpenTimePicker:false});
  }
  clickCancelTime()
  {
    this.setState({isOpenTimePicker:false});
  }
  clickDate(day)
  {
      var now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      //console.warn(day.dateString);
      var pickerDate = new Date(Date.parse(day.dateString));
      if (now.getTime() < pickerDate.getTime())      
        self.setState({selectedDate:day.dateString})
  }
  setTimePicker()
  {
      if (this.state.isOpenTimePicker)
      {
          return (
            <View style={{left:0,top:0,bottom:0,right:0,position:'absolute',padding:10,flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{position:'absolute',backgroundColor:'#000',opacity:0.5,left:0,bottom:0,right:0,top:0}}></View>
                <View>
                    <View style={{backgroundColor:'#0897CE',borderTopLeftRadius:10,borderTopRightRadius:10,padding:15,width:300}}>
                        <Text style={{fontSize:16,color:'#B5E0F0'}}>{this.state.selectYear}</Text>
                        <Text style={{fontSize:22,color:'#fff',fontWeight:'bold'}}>{this.getFormatDatetime()}</Text>
                    </View>
                    <View style={{backgroundColor:'#fff',borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:5,width:300}}>
                        <Calendar
                            minDate={'2000-01-01'}                            
                            maxDate={'2050-12-31'}                            
                            onDayPress={(day) => this.clickDate(day)}
                            monthFormat={'MMMM yyyy'}                            
                            onMonthChange={(month) => {console.log('month changed', month)}}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#0D99CF',
                                selectedDayBackgroundColor: '#0897CE',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#45465B',
                                dayTextColor: '#45465B',
                                textDisabledColor: '#91929E',
                                arrowColor: '#45465B',
                                monthTextColor: '#525366',                                
                                textMonthFontWeight: 'bold',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16
                            }}
                            markedDates={{[this.state.selectedDate]: {selected: true}}}                              
                        />
                        <View>
                            <Text style={{textAlign:'center',fontSize:18,color:'#000'}}>Time</Text>
                            
                            <View style={{flexDirection:'row',height:80}}>
                                <Picker style={{height: 80,flex:1}}
                                    selectedValue={this.state.selectHour} 
                                    itemStyle={{color:"#24253D", fontSize:16,height:80}}
                                    onValueChange={(index) => this.onHourPicker(index)}>
                                        {this.state.hours.map((value, i) => (
                                            <PickerItem label={value} value={i} key={"money"+value}/>
                                        ))}
                                </Picker>
                                <Picker style={{height: 80,flex:1}}
                                    selectedValue={this.state.selectMin} 
                                    itemStyle={{color:"#24253D", fontSize:16,height:80}}
                                    onValueChange={(index) => this.onMinutePicker(index)}>
                                        {this.state.minutes.map((value, i) => (
                                            <PickerItem label={value} value={i} key={"money"+value}/>
                                        ))}
                                </Picker>
                                <Picker style={{height: 80,flex:1}}                                
                                    selectedValue={this.state.selectZone} 
                                    itemStyle={{color:"#24253D", fontSize:16,height:80}}
                                    onValueChange={(index) => this.onZonePicker(index)}>
                                        {this.state.timezone.map((value, i) => (
                                            <PickerItem label={value} value={i} key={"money"+value}/>
                                        ))}
                                </Picker>
                            </View>
                            <View style={{flexDirection:'row',marginTop:10,paddingLeft:10,paddingRight:10,backgroundColor:'#fff'}}>
                                <CheckBox
                                    style={{flex:2}}
                                    textStyle={{color:'#888'}}
                                    checkBoxColor={'#CAD6DC'}
                                    checkedCheckBoxColor={'#5E9FE3'}
                                    uncheckedCheckBoxColor={'#CAD6DC'}
                                    onClick={()=>{
                                        this.setState({
                                            isMostActive:!this.state.isMostActive
                                        })
                                    }}
                                    isChecked={this.state.isMostActive}
                                    rightText={"When most active"}
                                />

                                <CheckBox
                                    style={{flex:1}}
                                    textStyle={{color:'#888'}}
                                    checkBoxColor={'#CAD6DC'}
                                    checkedCheckBoxColor={'#5E9FE3'}
                                    uncheckedCheckBoxColor={'#CAD6DC'}
                                    onClick={()=>{
                                        this.setState({
                                            isAsap:!this.state.isAsap
                                        })
                                    }}
                                    isChecked={this.state.isAsap}
                                    rightText={"ASAP"}
                                />
                            </View>
                            <View style={{flexDirection:'row',margin:10,backgroundColor:'#fff'}}>
                                <TouchableOpacity style={{marginLeft:10}} onPress={() => { this.clickCancelTime() }}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <View  style={{flex:1}}></View>
                                <TouchableOpacity style={{marginRight:20}} onPress={() => { this.clickSetTime() }}>
                                    <Text style={{color:'#109AD0'}}>Set Time</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
          );
      }
  }

  clickTimePicker()
  {
    Keyboard.dismiss();
    this.setState({isOpenTimePicker:true});
  }


  render() {    
    return (      
        <KeyboardAvoidingView style={[styles.bg,styles.flexFull]} behavior="padding" enabled>
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=>this.props.navigation.goBack()}>
                        <Image style={[styles.img15]} source={require('../assets/x-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:20}]}>
                    <TouchableOpacity>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>{this.state.athInfo.first_name} {this.state.athInfo.last_name}</Text>                            
                        </View>
                    </TouchableOpacity>
                </View>                
            </View>            
            <FlatList
              ref={ref => this.flatMessage = ref}              
              style={{flex:1}}
              data={this.state.messages}
              renderItem={({item,index}) => this.renderMessageItem(item,index)}
              keyExtractor={(item, index) => index.toString()}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
            {this.renderAttachMedia()}
            <View style={{minHeight:110,backgroundColor:'#1B242D',paddingBottom:10}}>
                <TextInput ref={ref => this.inputMessage = ref} onChangeText={(text) => this.setState({message:text})} multiline={true} style={{margin:10,backgroundColor:'#2D353D',color:'#969A9E',fontSize:16,minHeight:40,padding:10,textAlignVertical: 'center'}} placeholderTextColor="#969A9E" placeholder="Start a message..."/>
                <View style={{height:40,flexDirection:'row',alignItems:'center',paddingLeft:10,paddingRight:10,paddingBottom:10}}>
                    <TouchableOpacity onPress={() => { this.dlgImagePicker.show()}}>
                        <Image style={{width:30,height:24}} source={require('../assets/ic_cam.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft:20}} onPress={() => {this.clickTimePicker();this.initTime();}}>
                        <Image style={{width:30,height:30}} source={require('../assets/ic_calendar.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>                        
                        <Text style={[styles.textColorBlue,{fontSize:16,fontWeight:'bold',textAlign:'center'}]}>Send as:</Text>                        
                        <TouchableOpacity style={{marginLeft:20}} onPress={()=>this.sendMessage()}>
                            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#7ED321',width:40,height:40,borderRadius:20}}>
                                <Image style={{width:24,height:20}} source={require('../assets/ic_msg_white.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={{backgroundColor:'#64686C',width:2,height:40,marginLeft:10}}/>
                        <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.sendTwitter()}>
                            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#2491C9',width:40,height:40,borderRadius:20}}>
                                <Image style={{width:20,height:20}} source={require('../assets/twitter-white-512.png')}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {this.setTimePicker()}            
            <ActionSheet
                ref={o => this.dlgImagePicker = o}                
                options={['From Media Library', 'From Device', 'Take Photo or Video','Cancel']}
                cancelButtonIndex={3}                
                onPress={(index) => { this.clickPickerSelect(index) }}
            />
        </KeyboardAvoidingView>      
    );
  }
}