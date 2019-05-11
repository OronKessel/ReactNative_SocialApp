import React, {Component} from 'react';
import {Platform, FlatList,Linking,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import Drawer from 'react-native-drawer'
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../common/style';
import {serviceGetMessages} from '../api/message/message';
import {formatDate,getDay,getDateTimeStringQuote} from '../util/utils';


const { styles } = Styles;

var self= null;
export default class QueueScreen extends Component {
  constructor(props) {
    super(props);
    self = this;    
    const {state} = props.navigation;    
    this.state = {
        userInfo:state.params.userInfo,
        messages:[],
        isVisibleSpin:false,
        refreshing:false
    }
    
  }
  componentDidMount()
  {   
      this.setState({isVisibleSpin:true});
      this.webGetMessages();             
  }  
  renderSeparator()
  {
    return(
        <View style={{backgroundColor:'#323E49',height:1}}>
          
        </View>
      );
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
  
  clickItem(item,index)
  {
    this.props.navigation.navigate('ConversationScreen',{athlet:item,userInfo:self.state.userInfo});
  }
  renderAddUnread(item)
  {

        if (item.recipients != null && item.recipients.status != null && item.recipients.status.total != null && item.recipients.status.total > 0)        
        {
            return (
                <Text style={{color:'#fff',backgroundColor:'#0897CE',padding:3,borderRadius:5,position:'absolute',marginLeft:25,top:16}}>
                {item.recipients.status.total}
                </Text>
            );
         }
  }
  clickDetailQueue(item)
  {
    this.props.navigation.navigate('QueueDetailScreen',{userInfo:this.state.userInfo,queueInfo:item,onGoBack: () => this.handleRefresh()});
  }
  renderQueueItem(item,index)
  {   
      var backColor = "#263440";   
      if (index % 2 == 1)
      {
          backColor = '#25313C';
      }
      var duration = 0;      
      return(
        <View>            
            <View style={{backgroundColor:backColor,flexDirection:'row',alignItems:'flex-start',padding:10}}>                
                <View>
                    <Image style={{width:30,height:30,marginRight:30,marginLeft:10}} source={require('../assets/msg.png')}/>
                    {this.renderAddUnread(item)}
                </View>
                <View style={{flex:1}}>
                    <View>
                        <Text style={{color:'#90969B',fontSize:14,flex:1}}>Message Text:</Text>
                        <Text style={{color:'#C6C9CC',fontSize:14,flex:1}}>{item.body}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'#90969B',fontSize:14}}>Begin sending:</Text>
                        <Text style={{color:'#C6C9CC',fontSize:14,flex:1,marginLeft:5}}>{getDateTimeStringQuote(new Date(Date.parse(item.next_send_at)))}</Text>
                    </View>
                    {
                        item.media && item.media.id?
                        <View>
                            <Image style={{width:120,height:100}} source={{uri:item.media.urls.medium}}/>                        
                        </View>
                        :null                    
                    }
                    
                    <View>
                        <Text style={{color:'#90969B',fontSize:14,flex:1}}>Queued  {getDateTimeStringQuote(new Date(Date.parse(item.created_at)))} by {item.sender}</Text>                        
                    </View>
                </View>                
                <View>
                    <TouchableOpacity onPress={()=>this.clickDetailQueue(item)}>
                        <Image style={{width:30,height:30}} source={require('../assets/ic_dots.png')}/>                    
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>            
        </View>   
      );
  }
  handleRefresh()
  {
        self.setState({refreshing:true});
        self.webGetMessages();
  }
  renderQueue()
  {      
    return(
        <FlatList              
          data={this.state.messages}
          renderItem={({item,index}) => this.renderQueueItem(item,index)}
          keyExtractor={(item, index) => index.toString()}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
    )
  }
  webGetMessages()
  {    
    serviceGetMessages()
    .then(res=>{        
        self.setState({isVisibleSpin:false,messages:res,refreshing:false});
    })
    .catch(err=>{
        self.setState({isVisibleSpin:false,refreshing:false});
    });
  }
  render() {
    return (              
        <View style={[styles.bg,styles.flexFull]}>        
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=>this.props.navigation.goBack()}>
                        <Image style={[styles.img15]} source={require('../assets/back-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:15}]}>
                    <TouchableOpacity>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>Message Queue</Text>                            
                        </View>
                    </TouchableOpacity>
                </View>                                
            </View>            
            {this.renderQueue()}
            {this.renderLoading()}
      </View>
    );
  }
}