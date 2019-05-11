import React, {Component} from 'react';
import {Platform, FlatList,Linking,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import Styles from '../common/style';
import {serviceGetMessage,serviceDeleteMessage} from '../api/message/message';
import ActionSheet from 'react-native-actionsheet';
import {getDateTimeStringQuote} from '../util/utils';

const { styles } = Styles;

var self= null;
export default class QueueDetailScreen extends Component {
  constructor(props) {
    super(props);
    var dlgImagePicker;
    self = this;    
    const {state} = props.navigation;    
    this.state = {
        queueInfo:state.params.queueInfo,
        userInfo:state.params.userInfo,
        info:{},
        isVisibleSpin:false,
        isVisibleConfirm:false,
        isVisibleDelete:false,
        isMaskShow:'none',
        maskPos:'relative',
        filterContacts:[{first_name:'John',last_name:'Terry'},{first_name:'Joh1n',last_name:'Terry2'}],
        contacts:[],
        refreshing:false
    }
    
  }
  componentDidMount()
  {
      this.setState({isVisibleSpin:true});
      this.webGetMessage();
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
  
  webGetMessage()
  {
    //console.warn(this.state.queueInfo.id);
    serviceGetMessage(this.state.queueInfo.id)
    .then(res=>{        
        //console.warn(res);
        self.setState({isVisibleSpin:false,info:res});
    })
    .catch(err=>{        
        self.setState({isVisibleSpin:false});
    });
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
  renderAddUnread()
  {
        if (this.state.queueInfo.recipients != null && this.state.queueInfo.recipients.status != null 
            && this.state.queueInfo.recipients.status.total != null && this.state.queueInfo.recipients.status.total > 0)        
        {
            return (
                <Text style={{color:'#fff',backgroundColor:'#0897CE',padding:3,borderRadius:5,position:'absolute',marginLeft:25,top:16}}>
                {this.state.queueInfo.recipients.status.total}
                </Text>
            );
        }        
  }
  renderDelete()
  {      
    if (this.state.isVisibleDelete)
    {
        return(
            <View style={{position:'absolute',top:60,bottom:0,right:0,left:0,backgroundColor:'#25313C',alignItems:'center',justifyContent:'center'}}>
                <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                    <Image style={{width:96,height:96}} source={require('../assets/checkmark.png')}/>
                    <Text style={{color:'#90969B',fontSize:14,marginTop:10}}>All messages have been cleared from your queue</Text>                                 
                </View>            
            </View>
        )
    }
  }
  renderToText()
  {
    if (this.state.info.recipients == null) return "";
    var singleText = "";
    var boardText = "";
    for (i = 0;i < this.state.info.recipients.filter_list.length;i++)
    {
        boardText = boardText + this.state.info.recipients.filter_list[i].name + ","
    }
    
    if (this.state.info.recipients.athlete_list.length > 0)
    {
        
        if (this.state.info.recipients.athlete_list.length > 1)
        {
            singleText = "+" + this.state.info.recipients.athlete_list.length + " Athletes";
        }
        else
        {
            singleText = this.state.info.recipients.athlete_list[0].first_name + " " + this.state.info.recipients.athlete_list[0].last_name;
        }
    }
    if (singleText == '')
    {
        return boardText.substring(0,boardText.length - 1);
    }
    return boardText + singleText;
  }

  renderDetail()
  {      
    return(
        <View>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                <View>
                    <Image style={{width:30,height:30,marginRight:30,marginLeft:10}} source={require('../assets/msg.png')}/>
                    {this.renderAddUnread()}
                </View>
                <Text style={{color:'#90969B',fontSize:14,flex:1}}>MESSAGE QUEUED FOR DELIVERY</Text>
                <TouchableOpacity onPress={() => { this.dlgImagePicker.show()}}>
                    <Image style={{width:30,height:30,marginRight:10}} source={require('../assets/ic_dots.png')}/>                    
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>                
                <Text style={{color:'#90969B',fontSize:14,marginLeft:50}}>Send as:</Text>
                <Text style={{color:'#fff',fontSize:14,marginLeft:10}}>{this.state.info.platform}</Text>                
            </View>            
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                <Image style={{width:30,height:30,marginLeft:10}} source={require('../assets/man.png')}/>
                <Text style={{color:'#90969B',fontSize:14,marginLeft:10}}>Sender:</Text>
                <Text style={{color:'#fff',fontSize:14,marginLeft:10}}>{this.state.info.sender}</Text>                
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                <Image style={{width:30,height:30,marginLeft:10}} source={require('../assets/man.png')}/>
                <Text style={{color:'#90969B',fontSize:14,marginLeft:10}}>Recipient:</Text>
                <Text style={{color:'#fff',fontSize:14,marginLeft:10}}>{this.renderToText()}</Text>                
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                <Image style={{width:30,height:30,marginLeft:10}} source={require('../assets/msg.png')}/>
                <Text style={{color:'#90969B',fontSize:14,marginLeft:10}}>Begin Sending:</Text>
                <Text style={{color:'#fff',fontSize:14,marginLeft:10,flex:1}}>{getDateTimeStringQuote(new Date(Date.parse(this.state.info.next_send_at)))}
                {
                  this.state.info.send_when_most_active? " or when most active":""
                }  
                </Text>                
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                <Image style={{width:30,height:30,marginLeft:10}} source={require('../assets/twitter-white-512.png')}/>
                <Text style={{color:'#90969B',fontSize:14,marginLeft:10}}>Twitter message:</Text>                
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>                
                <Text style={{color:'#fff',fontSize:14,marginLeft:50}}>{this.state.info.body}</Text>                
            </View>
            {
                this.state.info.media && this.state.info.media.id?
                <View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                        <Image style={{width:30,height:30,marginLeft:10}} source={require('../assets/ic_cam.png')}/>
                        <Text style={{color:'#90969B',fontSize:14,marginLeft:10}}>Media:</Text>                
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                        <Image style={{width:120,height:100,marginLeft:10}} source={{uri:this.state.info.media.urls.medium}}/>                
                    </View>
                </View>
                :null                    
            }            
            <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>                
                <Text style={{color:'#fff',fontSize:14,marginLeft:50}}>Queued {getDateTimeStringQuote(new Date(Date.parse(this.state.info.updated_at)))} by {this.state.info.sender}</Text>                
            </View>
        </View>
    )
  }
  backCallback()
  {
    this.setState({isVisibleSpin:true});
    this.webGetMessage();
  }
  clickMenu(index)
  {
    if (index == 0)
    {
        this.props.navigation.navigate('EditMessageScreen',{queueInfo:this.state.info,userInfo:this.state.userInfo,onGoBack: () => this.backCallback()})                        
    }
    else if (index == 1)
    {
        this.setState({isVisibleConfirm:true});
    }
  }
  cancelDelete()
  {
    this.setState({isVisibleConfirm:false});
  }
  submitDelete()
  {
      this.setState({isVisibleConfirm:false,isVisibleSpin:true});
      this.webDeleteMessage();    
  }
  webDeleteMessage()
  {
        serviceDeleteMessage("",this.state.queueInfo.id)
        .then(res=>{                    
            self.setState({isVisibleSpin:false,isVisibleDelete:true});
            self.clickBack();

        })
        .catch(err=>{
            self.setState({isVisibleSpin:false});
        });
  }
  clickBack()
  {
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  }
  render() {
    return (              
        <View style={[styles.bg,styles.flexFull]}>        
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=>this.clickBack()}>
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
            {this.renderDetail()}
            {this.renderDelete()}
            <Dialog.Container visible={this.state.isVisibleConfirm}>                
                <Dialog.Description>
                    Are you sure you want to delete this message from the queue?
                </Dialog.Description>                
                <Dialog.Button label="Cancel" onPress={()=> this.cancelDelete()}/>
                <Dialog.Button label="Delete" onPress={()=> this.submitDelete()}/>
            </Dialog.Container>
            <ActionSheet
                ref={o => this.dlgImagePicker = o}                
                options={['Edit', 'Delete','Cancel']}
                cancelButtonIndex={2}                
                onPress={(index) => { this.clickMenu(index) }}
            />
            {this.renderLoading()}
      </View>
    );
  }
}