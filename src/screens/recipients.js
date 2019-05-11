import React, {Component} from 'react';
import {Platform, FlatList,Linking,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../common/style';
import {serviceGetFilter} from '../api/organization/filter';

const { styles } = Styles;

var self= null;
export default class RecipientScreen extends Component {
  constructor(props) {
    super(props);
    self = this;    
    const {state} = props.navigation;    
    this.state = {
        isBoard:state.params.isBoard,
        info:state.params.info,
        contacts:[],
        refreshing:false,
        recipients:[],
    }
    
  }
  componentDidMount()
  { 
      if (this.state.isBoard)
        this.webGetAthlets();
      else
      {        
        self.setState({contacts:this.state.info});
      }
  }
  
  webGetAthlets()
  {    
    serviceGetFilter(this.state.info.id)
    .then(res=>{        
        self.setState({contacts:res.athletes});
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
  renderContactItem(item,index)
  {         
      var backColor = "#263440";   
      if (index % 2 == 1)
      {
          backColor = '#25313C';
      }      
      return(
        <TouchableOpacity>
            <View>            
                <View style={{backgroundColor:backColor,flexDirection:'row',alignItems:'center',padding:10}}>                
                    <Image style={[styles.img50,{borderRadius:25}]} source={{uri:item.twitter_profile?item.twitter_profile.profile_image:''}}/>
                    <Text style={[styles.whiteColor,{fontSize:18,flex:1,marginLeft:10}]}>{item.first_name} {item.last_name}</Text>                   
                </View>
                <View style={{backgroundColor:'#323E49',height:1}}></View>            
            </View>        
        </TouchableOpacity>
      );
  }  
  backScreen()
  {
    //this.props.navigation.state.params.onGoBack(this.state.recipients);
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
                            <Text style={[styles.textColorBlue,{fontSize:16,textAlign:'center'}]}>
                            {
                              this.state.isBoard?
                              this.state.info.name:'Individual Athletes'
                            }
                            </Text>                            
                        </View>
                    </TouchableOpacity>
                </View>                                
            </View>            
            <FlatList              
                data={self.state.contacts}
                renderItem={({item,index}) => this.renderContactItem(item,index)}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}                
             />
            {this.renderLoading()}
      </View>
    );
  }
}