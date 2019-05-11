import React, {Component} from 'react';
import {Keyboard,ScrollView,KeyboardAvoidingView,Platform, Dimensions,Animated,FlatList,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import { Calendar } from 'react-native-calendars';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator,ViewPager} from 'rn-viewpager';

import Styles from '../common/style';
import {serviceGetAthletes} from '../api/organization/athlete';
import {serviceGetFilters} from '../api/organization/filter';
import {serviceCreateMessage} from '../api/message/message';
import {serviceCreateMedia} from '../api/media/media';
import {getFormattedDate,validateTime,validateDate,getDateTimeString,getDateString} from '../util/utils';
import {Global} from '../doc/global';

import AthleteView from '../components/athlete'
import BoardView from '../components/board'

import CheckBox from 'react-native-check-box'
import Picker from 'react-native-wheel-picker'

var PickerItem = Picker.Item;


const { styles } = Styles;

var self= null;
export default class MessageScreen extends Component {
  constructor(props) {
    super(props);
    self = this;  
    var inputTo;
    var inputMessage;
    var dlgImagePicker;
    var viewpager;
    date = new Date();
    currentDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    const {state} = props.navigation;    
    this.isLoad = false;
    this.state = {
        tabIndex:0,
        athlets:[],
        orgAthletes:[],
        boards:Global.orgBoards,
        userInfo:state.params.userInfo,        
        message:'',        
        recipients:{
            boards:[],
            singles:[]
        },
        isVisibleSpin:false,
        isModeDropdown:false,
        msgMode:0,
        hasFocus:false,
        isPreview:false,
        cursorPos:0,
        isQueue:false,        
        mediaUri:'',
        mediaId:'',
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
        sendAt:'',
        sendAtString:'',
        athletePage:0,
        isSearch:false,
    }
    
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

  webSendMedia()
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
          this.webCreateMessage(res.id);
      })
      .catch(err=>{
        
    });
  }
  webCreateMessage(mediaId)
  {
      var aIds = '';
      var bIds = '';
      for (i = 0;i < this.state.recipients.singles.length;i++)
      {
          aIds = aIds + this.state.recipients.singles[i].id + ','
      }
      if (aIds != '')
        aIds = aIds.substring(0,aIds.length-1);
      for (i = 0;i < this.state.recipients.boards.length;i++)
      {
        bIds = bIds + this.state.recipients.boards[i].id + ','
      }
      if (bIds != '')
        bIds = bIds.substring(0,bIds.length-1);  
      var platform = "SMS";
      if (this.state.msgMode == 0)
        platform = "Twitter";
      var msgInfo ={
        body:this.state.message,
        athletes:aIds,
        filters:bIds,
        sendat:this.state.sendAt,
        media_id:mediaId,
        mostactive:this.state.isMostActive,
        platform:platform
      };
      this.setState({recipients:{
        boards:[],
        singles:[]
      }});
      this.inputMessage.clear();
      this.inputTo.clear();
      serviceCreateMessage(msgInfo)
        .then(res=>{                    
            self.setState({isVisibleSpin:false,isQueue:true});
        })
        .catch(err=>{            
            //console.warn(err);
            self.setState({isVisibleSpin:false});
        });
  }
  loadMoreAthlete()
  {
    if (!this.state.isSearch)
    {
      //this.setState({isVisibleSpin:true});      
      this.webGetAthlets();
    }
  }
  webSearchAthletes(search)
  {
      var options = {
          page:1,
          ppage:500,
          sort:'first_name',
          sortdir:'asc',
          search:search
      };    
      serviceGetAthletes(options)
      .then(res=>{
            //console.warn(res);
            this.setState({athlets:res,isVisibleSpin:false});
      })
      .catch(err=>{      
          //console.warn(err);
          self.setState({isVisibleSpin:false});        
      });
  }
  webGetAthlets()
  { 
    var options = {
        page:this.state.athletePage + 1,
        ppage:10,
        sort:'first_name',
        sortdir:'asc',
        search:''
    };    
    serviceGetAthletes(options)
    .then(res=>{
          this.setState({orgAthletes:this.state.athlets.concat(res),athlets:this.state.athlets.concat(res),athletePage: this.state.athletePage + 1,isVisibleSpin:false});      
    })
    .catch(err=>{      
        self.setState({isVisibleSpin:false});        
    });
  }
  webGetTeamMembers()
  {
    serviceGetFilters()
    .then(res=>{
        //console.warn(res);
        Global.boards = res;
        Global.orgBoards = res;
        self.setState({boards:res});
    })
    .catch(err=>{
        
    });
  }  
  onBackBoardList(recipients)
  {
    var reps = this.state.recipients;
    for (i = 0;i < recipients.length;i++)
    {        
        for (j = 0;j < reps.singles.length;j++)
        {
            if (reps.singles[j].id == recipients[i].id)
            {
                return;
            }
        }
        recipients[i].name = recipients[i].first_name + " " + recipients[i].last_name;      
        reps.singles.push(recipients[i]);
    }      
    self.setState({recipients:reps})
  }
  clickTeamDetail(item,index){
       this.props.navigation.navigate('BoardlistScreen',{teamInfo:item,onGoBack: (recipients) => this.onBackBoardList(recipients)});
  }
  clickTeam(item,index)
  {    
    var recipients = this.state.recipients;
    for (i = 0;i < recipients.boards.length;i++)
    {
        if (recipients.boards[i].id == item.id)
        {
            return;
        }
    }    
    recipients.boards.push(item);
    this.inputTo.clear();
    this.filterAthlet('');
    self.setState({recipients:recipients})
  }
  clickAthlet(item,index)
  {
      var recipients = this.state.recipients;
      for (i = 0;i < recipients.singles.length;i++)
      {
          if (recipients.singles[i].id == item.id)
          {
              return;
          }
      }
      item.name = item.first_name + " " + item.last_name;      
      recipients.singles.push(item);
      this.inputTo.clear();
      this.filterAthlet('');
      self.setState({recipients:recipients})
  }
  componentDidMount()
  {
      this.setState({isVisibleSpin:true});      
      this.webGetAthlets();            
    // if (Global.orgAthletes.length == 0)    
    // {
        
    // }
    if (Global.boards.length == 0)
      this.webGetTeamMembers();    
        
    this.initTime();
  }
  clickMsgMode(mode)
  {
      this.setState({msgMode:mode});
      this.setState({isModeDropdown:false});
  }
  renderTitle()
  {
      if (this.state.msgMode == 0)
      {
          return "Twitter DM";
      }
      else 
      {
          return "Text Message";
      }
  }
  clickTopMode()
  {
    this.setState({isModeDropdown:!this.state.isModeDropdown});
  }
  endInputTo()
  {
    //this.setState({hasFocus:false});
  }
  startInputTo()
  {    
    // this.setState({hasFocus:true});
    // setTimeout(() => {
    //     self.inputTo.focus();
    // }, 800);
  }
  onTabClick(index)
  {    
    this.setState({tabIndex:index});    
    this.viewpager.setPage(index);
  }
  pageSelected(index)
  {      
      this.setState({tabIndex:index.position});
  }

  renderContacts()
  {     
       var textColor1 = '#fff';
       var textColor2 = '#868C93';   
       if (this.state.tabIndex == 1)
       {
          textColor1 = '#868C93'
          textColor2 = '#fff'
       }
       return(
          <View style={{flex:1}}>
              <View style={{flexDirection: 'row',backgroundColor:'#25313C'}}>
                <TouchableOpacity
                  style={{flex: 1,alignItems: 'center',padding: 16}}
                  onPress={() => this.onTabClick(0)}>                
                  <Text style={{color:textColor1}}>Athletes</Text>
                </TouchableOpacity>
                <View style={{width:1,backgroundColor:'#323E49'}}>
                </View>
                <TouchableOpacity
                  style={{flex: 1,alignItems: 'center',padding: 16}}
                  onPress={() => this.onTabClick(1)}>
                  <Text style={{color:textColor2}}>Boards</Text>
                </TouchableOpacity>                    
              </View>
              <View style={{flex:1}}>
                <ViewPager ref={ref => this.viewpager = ref}  style={{flex:1}}
                  onPageSelected={(index) => this.pageSelected(index)}>                    
                    <View>
                        <AthleteView items={this.state.athlets} clickItem={this.clickAthlet.bind(this)} loadMore={this.loadMoreAthlete.bind(this)} />
                    </View>
                    <View>
                        <BoardView items={this.state.boards} clickItem={this.clickTeam.bind(this)} clickTeamDetail={this.clickTeamDetail.bind(this)}/>
                    </View>                    
                </ViewPager>
              </View>
          </View>
       );       
  }
  renderDropdown()
  {
      if (this.state.isModeDropdown)
      {
        return (
            <View style={{position:'absolute',top:60,left:0,right:0,backgroundColor:'#35434E'}}>
                <View style={{height:80}}>
                    <TouchableOpacity onPress={()=>this.clickMsgMode(0)}>
                        <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                            <Image style={{width:20,height:20,marginLeft:10}} source={require('../assets/twitter-512.png')}></Image>
                            <Text style={{color:'#2784B5',fontSize:14,marginLeft:15,flex:1}}>Twitter DM</Text>
                            {this.state.msgMode == 0? <Image style={{width:20,height:17,marginLeft:10,marginRight:15}} source={require('../assets/check-blue-512.png')}></Image>:null}
                            
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.clickMsgMode(1)}>
                        <View style={{height:40,flexDirection:'row',padding:10,alignItems:'center'}}>
                            <Image style={{width:20,height:17,marginLeft:10}} source={require('../assets/ic_msg.png')}></Image>
                            <Text style={{color:'#2784B5',fontSize:14,marginLeft:15,flex:1}}>Text Message</Text>
                            {this.state.msgMode == 1? <Image style={{width:20,height:17,marginLeft:10,marginRight:15}} source={require('../assets/check-blue-512.png')}></Image>:null}                        
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height:5,backgroundColor:'#1B8DCA'}}>

                </View>
            </View>
        );
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
            <View style={{flexDirection:'row',height:120,backgroundColor:'#1B242D'}}>
                <Image source={{uri:this.state.mediaUri}} style={{marginLeft:10,marginTop:10,width:120,height:100}}/>
                <TouchableOpacity style={{position:'absolute',left:107,top:15}} onPress={() => { this.removeAttach() }}>
                    <Image source={require('../assets/x-512.png')} style={{width:13,height:13}}/>
                </TouchableOpacity>
            </View>
          );
      }
  }

  removeRecipientBoard(value)
  {
      var recs = this.state.recipients;
      for (i = 0;i < recs.boards.length;i++)
      {
          if (recs.boards[i].id == value.id)
          {
              recs.boards.splice(i,1)
              break;
          }
      }
      this.setState({recipients:recs});
  }
  removeSingle(value)
  {
    var recs = this.state.recipients;
    for (i = 0;i < recs.singles.length;i++)
    {
        if (recs.singles[i].id == value.id)
        {
            recs.singles.splice(i,1)
            break;
        }
    }
    this.setState({recipients:recs});
  }
  renderRecipients()
  {     
        return (        
            self.state.recipients.boards.map((value,index) => (
                <View key={"to" + value.id} style={{flexDirection:'row',borderRadius:5,marginLeft:3,marginRight:3,alignItems:'center',backgroundColor:'#2990C8',padding:10,marginTop:3}}>
                    <TouchableOpacity onPress={() => { this.removeRecipientBoard(value) }}>
                        <Image style={{width:10,height:10}} source={require('../assets/x-512.png')}/>
                    </TouchableOpacity>
                    <Text style={{marginLeft:5,color:'#fff'}}>{value.name}</Text>
                </View>                                
            ))        
        );
  }
  renderSingleRecipient()
  {
    return (        
        self.state.recipients.singles.map((value,index) => (
            <View key={"to" + value.id} style={{flexDirection:'row',borderRadius:5,marginLeft:3,marginRight:3,alignItems:'center',backgroundColor:'#2990C8',padding:10,marginTop:3}}>
                <TouchableOpacity onPress={() => { this.removeSingle(value) }}>
                    <Image style={{width:10,height:10}} source={require('../assets/x-512.png')}/>
                </TouchableOpacity>
                <Text style={{marginLeft:5,color:'#fff'}}>{value.first_name + ' ' + value.last_name}</Text>
            </View>                                
        ))        
    );    
  }
  clickDone()
  {
        self.setState({isQueue:false});   
        self.props.navigation.goBack();  
  }
  clickGoQueue()
  {
    self.props.navigation.state.params.onGoBack();
    self.props.navigation.goBack();
  }
  renderConfirmPreview()
  {
      if (this.state.isQueue)
      {
        return(
            <View style={{left:0,top:0,bottom:0,right:0,position:'absolute',padding:10,flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{position:'absolute',backgroundColor:'#000',opacity:0.5,left:0,bottom:0,right:0,top:0}}></View>
                <View>
                    <View style={{backgroundColor:'#0897CE',borderTopLeftRadius:10,borderTopRightRadius:10,padding:15,width:330}}>                    
                        <Text style={{fontSize:22,color:'#fff',fontWeight:'bold',textAlign:'center'}}>Message Queued</Text>
                    </View>
                    <View style={{backgroundColor:'#fff',borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:10,width:330}}>
                        <Text style={{color:'#000',marginLeft:30,marginRight:30,textAlign:'center',marginTop:25}}>Great Job! Your message has been queued for delivery!</Text>
                        <View style={{alignItems:'center',marginTop:20}}>
                            <Image style={{width:96,height:96}} source={require('../assets/queue.png')}/>                        
                        </View>                    
                        <TouchableOpacity onPress={()=>this.clickGoQueue()} style={{marginTop:25,marginLeft:20,marginRight:20}}>
                            <View style={{backgroundColor:'#0897CE',height:45,padding:10,borderRadius:15}}>
                                <Text style={{color:'#fff',fontSize:16,textAlign:'center'}}>View Message Queue</Text>
                            </View>                            
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.clickDone()} style={{marginTop:10,marginLeft:20,marginRight:20,marginBottom:20}}>
                            <View style={{borderWidth:1,borderColor:'#0897CE',height:45,padding:10,borderRadius:15}}>
                                <Text style={{color:'#0897CE',fontSize:16,textAlign:'center'}}>Done</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
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
  renderPreview()
  {
      if (self.state.isPreview)
      {
        return(
            <View style={{left:0,top:0,bottom:0,right:0,position:'absolute',padding:10,flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{position:'absolute',backgroundColor:'#000',opacity:0.5,left:0,bottom:0,right:0,top:0}}></View>
                <View>
                    <View style={{backgroundColor:'#0897CE',borderTopLeftRadius:10,borderTopRightRadius:10,padding:15,width:330}}>                    
                        <Text style={{fontSize:22,color:'#fff',fontWeight:'bold',textAlign:'center'}}>Message Preview</Text>
                    </View>
                    <View style={{backgroundColor:'#fff',borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:10,width:330}}>
                        <View style={{flexDirection:'row',marginLeft:10,marginRight:10,marginTop:20}}>
                            <Text style={{width:80,color:'#898E93'}}>Send as:</Text>                        
                            <Text style={{color:'#000',marginLeft:10}}>{this.renderTitle()}</Text>
                        </View>                    
                        <View style={{flexDirection:'row',marginLeft:10,marginRight:10,marginTop:10}}>
                            <Text style={{width:80,color:'#898E93'}}>Send from:</Text>
                            <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{color:'#000',marginLeft:10}}>You ( </Text>
                                {
                                    this.state.msgMode == 0?
                                    <Image style={{width:20,height:20}} source={require('../assets/twitter-512.png')}/>
                                    :
                                    <Image style={{width:20,height:17}} source={require('../assets/ic_msg.png')}/>
                                }
                                {
                                    this.state.msgMode == 0?
                                    <Text style={{color:'#000'}}> {this.state.userInfo.twitter_profile.screen_name})</Text>
                                    :
                                    <Text style={{color:'#000'}}> {this.state.userInfo.sms_number})</Text>
                                }
                            </View>                        
                        </View>  

                        <View style={{flexDirection:'row',marginLeft:10,marginRight:10,marginTop:10}}>
                            <Text style={{width:80,color:'#898E93'}}>Send to:</Text>
                            {this.renderToText()}                        
                        </View>
                        <View style={{flexDirection:'row',marginLeft:10,marginRight:10,marginTop:10}}>
                            <Text style={{width:80,color:'#898E93'}}>Send time:</Text>                        
                            <Text style={{color:'#000',marginLeft:10,flex:1}}>{this.state.sendAtString}
                            {
                              this.state.isMostActive? " or when most active":""
                            }   
                            </Text>                        
                        </View>

                        <View style={{marginLeft:10,marginRight:10,marginTop:10}}>
                            <Text style={{color:'#898E93'}}>Message Text:</Text>                        
                            <Text style={{color:'#000',marginTop:10}}>{this.state.message}</Text>                        
                        </View>

                        {
                            this.state.mediaUri != ''?
                            <View style={{marginLeft:10,marginRight:10,marginTop:10}}>
                                <Text style={{color:'#898E93'}}>Media:</Text>
                                <View style={{alignItems:'center',marginTop:20,marginBottom:10}}>
                                    <View>
                                        <Image style={{width:200,height:200}} source={{uri:this.state.mediaUri}}/>                        
                                        <Image style={{position:'absolute',left:10,bottom:10,width:30,height:30}} source={require('../assets/camera-512.png')}/>
                                    </View>
                                </View>
                            </View>
                            : null
                        }

                        
                        <TouchableOpacity onPress={()=>this.queuePreview()} style={{marginTop:10,marginLeft:20,marginRight:20}}>
                            <View style={{backgroundColor:'#0897CE',height:45,padding:10,borderRadius:15}}>
                                <Text style={{color:'#fff',fontSize:16,textAlign:'center'}}>Queue Message</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.hidePreview()} style={{marginTop:10,marginLeft:20,marginRight:20}}>
                            <Text style={{color:'#888',fontSize:16,textAlign:'center',height:45,padding:10,borderRadius:15}}>Edit</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    }
  }
  renderToText()
  {
    var singleText = "";
    var boardText = "";
    //console.warn(self.state.recipients.boards);
    if (self.state.recipients.singles.length > 0)
    {
        
        if (self.state.recipients.singles.length > 1)
        {
            singleText = "+" + self.state.recipients.singles.length + " Athletes";
        }
        else
        {
            singleText = self.state.recipients.singles[0].name;
        }
    }
    return(
      <View style={{}}>
        {self.state.recipients.boards.map((value, i) => (
          <TouchableOpacity onPress={()=>this.clickPreviewBoard(value)}>
            <Text style={{color:'#62A3D0',textDecorationLine:'underline'}}>{value.name + "(" + value.athletes.count +  ")"}{(i == self.state.recipients.boards.length - 1 && singleText=='')?'':','}</Text>
          </TouchableOpacity>          
        ))}
        {
          singleText==''? null:
          <TouchableOpacity onPress={()=>this.clickPreviewAthletes()}>
            <Text style={{color:'#62A3D0',textDecorationLine:'underline'}}>{singleText}</Text>
          </TouchableOpacity>
        }
      </View>
    )    
  }
  onBackFromViewRecipient(info)
  {

  }
  clickPreviewBoard(boardInfo)
  {     
     this.props.navigation.navigate('RecipientScreen',{isBoard:true,info:boardInfo,onGoBack: (info) => this.onBackFromViewRecipient(info)});
  }
  clickPreviewAthletes()
  {
     this.props.navigation.navigate('RecipientScreen',{isBoard:false,info:self.state.recipients.singles,onGoBack: (info) => this.onBackFromViewRecipient(info)});
  }
  queuePreview()
  {
    this.setState({isPreview:false,isVisibleSpin:true});    
    if (this.state.mediaUri == '')
    {
        this.webCreateMessage('');
    }
    else 
    {
        if (this.state.mediaId == '')        
            this.webSendMedia();
        else
            this.webCreateMessage(this.state.mediaId);
    }

  }
  hidePreview()
  {
      this.setState({isPreview:false});
  }

  filterAthlet(text)
  {      
      Global.boards = [];
      if (text == '')
      {          
          Global.boards = Global.orgBoards;
          this.setState({isSearch:false,athlets:this.state.orgAthletes,boards:Global.orgBoards});
          return;
      }
      else
      {          
          for (var i = 0;i < Global.orgBoards.length;i++)
          {
              if (Global.orgBoards[i].name.includes(text))
              {
                  Global.boards.push(Global.orgBoards[i])
                  continue;
              }              
          }
          this.webSearchAthletes(text);
          this.setState({isSearch:true,boards:Global.boards});
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

  clickPreview()
  {
      if (this.state.message == "")
      {
        this.inputMessage.focus();
        return;
      } 
      if (this.state.recipients.boards.length == 0 && this.state.recipients.singles.length == 0) 
      {
          this.inputTo.focus();
          return;      
      }
      var pickerDate = new Date(Date.parse(self.state.selectedDate));      
      if (this.state.timezone[this.state.selectZone] == "AM")
      {
        pickerDate.setHours(this.state.selectHour);
        pickerDate.setMinutes(this.state.selectMin);        
      }
      else
      {
        if (this.state.selectHour < 12)
        {
            pickerDate.setHours(this.state.selectHour + 12);
            pickerDate.setMinutes(this.state.selectMin);        
        }
        else
        {
            pickerDate.setHours(this.state.selectHour);
            pickerDate.setMinutes(this.state.selectMin);        
        }
     }
    Keyboard.dismiss();
    var send_at = pickerDate.toISOString();
    //console.warn(send_at);
    send_at = pickerDate.getFullYear() + "-" + ("0" + (pickerDate.getMonth() + 1)).slice(-2) + "-" + ("0" + pickerDate.getDate()).slice(-2) + send_at.substring(10);
    //send_at = getDateString(self.state.selectedDate) + send_at.substring(10);
    //console.warn(send_at);
    sendAtString = getDateString(self.state.selectedDate) + " " + getDateTimeString(pickerDate);
    
    if (this.state.isAsap)
    {
        date = new Date();        
        send_at = date.toISOString();        
        send_at = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + send_at.substring(10);
        sendAtString = getDateString(self.state.selectedDate) + " " + getDateTimeString(date);        
    }    
    this.setState({isPreview:true,sendAt:send_at,sendAtString:sendAtString})
  }
  addName()
  {
      var text = this.state.message.substring(0,this.state.cursorPos) + "::name::" + this.state.message.substring(this.state.cursorPos);
      self.inputMessage.setNativeProps({text:text});
      this.setState({message:text})
  }
  spinnerStyle = function () {
    return {
      alignSelf:'center',
      justifyContent:'center',
      position:'absolute',
      top:0,
      bottom:0,
      left:0,right:0
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

  clickTimePicker()
  {
    Keyboard.dismiss();
    this.setState({isOpenTimePicker:true});
  } 
  
  render() {    
    return (      
        <KeyboardAvoidingView style={[styles.bg,styles.flexFull]} behavior="padding" enabled>
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar,{ shadowColor: '#000',shadowOffset: { width: 0, height: 5 },shadowOpacity: 0.5,shadowRadius: 2}]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=>this.props.navigation.goBack()}>
                        <Image style={[styles.img15]} source={require('../assets/back-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:20}]}>
                    <TouchableOpacity onPress={()=>this.clickTopMode()}>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={[styles.textColorBlue,{fontSize:14,textAlign:'center'}]}>{this.renderTitle()}</Text>
                            <Image style={[styles.img15,{marginLeft:5}]} source={require('../assets/caret-512.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>                
            </View>

            <View style={{minHeight:45,maxHeight:140,backgroundColor:'#1B242D',flexDirection:'row',alignItems:'center',marginTop:5}}>
                <Text style={{padding:10,fontSize:16,color:'#898E93'}}>To:</Text>
                <ScrollView>
                <View>
                  <View style={{flexDirection:'row',flex:1}}>
                      <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}>
                          {this.renderRecipients()}
                          {this.renderSingleRecipient()}
                          <TextInput ref={ref => this.inputTo = ref} onChangeText={(text) => this.filterAthlet(text)} onEndEditing={()=>this.endInputTo()} onFocus={()=>this.startInputTo()} style={{minWidth:100,color:'#fff',fontSize:16,marginLeft:10}}/>
                      </View>                    
                  </View>
                </View>
                </ScrollView>
                
            </View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <View style={{flex:1}}>
              {this.renderContacts()}
            </View>
            
            {/* <View>
                <Text style={{color:'#fff',margin:20,textAlign:'center',fontSize:16}}>It does not look like your account has been fully set up yet. Contract your team admin in order to first get started on RecruitSuite web version.</Text>
            </View> */}            
            {this.renderDropdown()}            
            {this.renderAttachMedia()}
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <View style={{minHeight:130,backgroundColor:'#1B242D',paddingBottom:10}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <TextInput ref={ref => this.inputMessage = ref} onSelectionChange={(event) => this.setState({cursorPos:event.nativeEvent.selection.start})} onChangeText={(text) => this.setState({message:text})} multiline={true} style={{margin:10,backgroundColor:'#2D353D',color:'#969A9E',fontSize:16,minHeight:40,padding:10,textAlignVertical: 'center'}} placeholderTextColor="#969A9E" placeholder="Start a message..."/>
                        <View style={{height:60,flexDirection:'row',alignItems:'center',paddingLeft:10,paddingRight:10,paddingBottom:10}}>
                            <Text style={{color:'#969A9E',fontSize:12}}>use</Text>
                            <TouchableOpacity onPress={() => { this.addName()}}>
                                <View style={{flexDirection:'row',borderRadius:5,marginLeft:3,marginRight:3,alignItems:'center',backgroundColor:'#2990C8',padding:10}}>                                                                
                                    <Text style={{color:'#fff',fontSize:12}}> + Name</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={{color:'#969A9E',fontSize:12,flex:1}}>to insert athlete name</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#64686C',width:1}}/>
                    <View style={{width:100}}>
                        <View style={{flex:1,justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={()=>this.clickPreview()} style={{marginBottom:10}}>
                                <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                                    <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>Preview</Text>                                
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:'#64686C',height:1,marginTop:10,marginBottom:10}}/>
                        <View style={{height:60,flexDirection:'row',alignItems:'center',paddingLeft:10,paddingRight:10,paddingBottom:10}}>
                            <TouchableOpacity onPress={() => { this.dlgImagePicker.show()}}>
                                <Image style={{width:30,height:24}} source={require('../assets/ic_cam.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:20}} onPress={() => {this.clickTimePicker()}}>
                                <Image style={{width:30,height:30}} source={require('../assets/ic_calendar.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>                                
            </View>
            {this.renderPreview()}
            {this.renderConfirmPreview()}
            {this.setTimePicker()}            
            <ActionSheet
                ref={o => this.dlgImagePicker = o}                
                options={['From Media Library', 'From Device', 'Take Photo or Video','Cancel']}
                cancelButtonIndex={3}                
                onPress={(index) => { this.clickPickerSelect(index) }}
            />
            {this.renderLoading()}
        </KeyboardAvoidingView>      
    );
  }
}