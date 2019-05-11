import React, {Component} from 'react';
import {Platform, FlatList,Linking,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../common/style';
import {serviceGetFilter} from '../api/organization/filter';

const { styles } = Styles;

var self= null;
export default class BoardlistScreen extends Component {
  constructor(props) {
    super(props);
    self = this;    
    const {state} = props.navigation;    
    this.state = {
        team:state.params.teamInfo,
        filterContacts:[],
        contacts:[],
        refreshing:false,
        recipients:[],
    }
    
  }
  componentDidMount()
  { 
      this.webGetAthlets();
  }
  
  webGetAthlets()
  {    
    serviceGetFilter(this.state.team.id)
    .then(res=>{        
        self.setState({contacts:res.athletes,filterContacts:res.athletes,refreshing:false});
    })
    .catch(err=>{
    });
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
  renderContactItem(item,index)
  {         
      var backColor = "#263440";   
      if (index % 2 == 1)
      {
          backColor = '#25313C';
      }      
      return(
        <TouchableOpacity onPress={()=>this.clickAdd(item,index)}>
            <View>            
                <View style={{backgroundColor:backColor,flexDirection:'row',alignItems:'center',padding:10}}>                
                    <Image style={[styles.img50,{borderRadius:25}]} source={{uri:item.twitter_profile.profile_image}}/>
                    <Text style={[styles.whiteColor,{fontSize:18,flex:1,marginLeft:10}]}>{item.first_name} {item.last_name}</Text>                                                        
                    {
                        item.selected == true?
                        <Image style={{width:30,height:30,marginRight:10}} source={require('../assets/ic_added.png')}/>                    
                        :
                        <Image style={{width:30,height:30,marginRight:10}} source={require('../assets/ic_add_circle.png')}/>                    
                    }
                    
                </View>
                <View style={{backgroundColor:'#323E49',height:1}}></View>            
            </View>        
        </TouchableOpacity>
      );
  }
  clickAdd(item,index)
  {
    var items = this.state.filterContacts;      
    var recips = this.state.recipients;
    if (item.selected)
    {
        var ii = recips.indexOf(item)
        if (index !== -1) {
            recips.splice(index, 1);            
        }
        item.selected = false;
    }
    else 
    {
        item.selected = true;
        recips.push(item);
    }
    items[index] = item;    
    this.setState({filterContacts:items,recipients:recips});    
  }
  handleRefresh()
  {
        self.setState({refreshing:true});
        self.webGetAthlets();
  }  
  filterAthlet(text)
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
  backScreen()
  {
    this.props.navigation.state.params.onGoBack(this.state.recipients);
    this.props.navigation.goBack();
  }
  render() {
    return (              
        <View style={[styles.bg,styles.flexFull]}>        
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=> this.backScreen()}>
                        <Image style={[styles.img15]} source={require('../assets/back-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:15}]}>
                    <TouchableOpacity>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>{this.state.team.name}</Text>                            
                        </View>
                    </TouchableOpacity>
                </View>                                
            </View>
            <TextInput style={styles.inputSearch} placeholder="Search" placeholderTextColor="#8D9196" onChangeText={(text) => this.filterAthlet(text)}/>
            <View style={{backgroundColor:'#323E49',height:1}}></View>            
            <FlatList              
                data={self.state.filterContacts}
                renderItem={({item,index}) => this.renderContactItem(item,index)}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
             />
            {this.renderLoading()}
      </View>
    );
  }
}