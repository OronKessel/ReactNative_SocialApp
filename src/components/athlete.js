import React, {Component} from 'react';
import {Keyboard,ScrollView,KeyboardAvoidingView,Platform, Dimensions,Animated,FlatList,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Styles from '../common/style';

const { styles } = Styles;

class AthleteView extends Component {

  constructor(props) {
    super(props)
    this.state = {
        refreshing:false,
    }
  }  
  shouldComponentUpdate(nextProps) {    
    return nextProps.items !== this.props.items
  }

  renderAthletItem(item,index)
  {         
      var backColor = "#263440";   
      if (index % 2 == 1)
      {
          backColor = '#25313C';
      }      
      return(
        <TouchableOpacity onPress={()=>this.props.clickItem(item,index)}>
            <View>            
                <View style={{backgroundColor:backColor,flexDirection:'row',alignItems:'center',padding:10}}>                
                    <View>
                        <Image style={[styles.img50,{borderRadius:25}]} source={{uri:item.twitter_profile.profile_image}}/>
                    </View>                
                    <View style={{marginLeft:10,flex:1}}>
                        <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                            <Text style={[styles.whiteColor,{fontSize:14}]}>{item.first_name} {item.last_name}</Text>                            
                        </View>
                        <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                            <Text style={{color:'#8F969C',fontSize:12}}>{item.twitter_profile.screen_name != null?'@':null}{item.twitter_profile.screen_name}{item.phone != null?' - ':null}{item.phone}</Text>                        
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
    this.setState({refreshing:false});
    //this.webGetAthlets();
  }
  onScrollHandler = () => {
     // this.setState({
     //    page: this.state.page + 1
     // }, () => {
     //    this.fetchRecords(this.state.page);
     // });
     console.warn('End reached');
  }
  render() {
    return(
        <View style={[styles.scene, { backgroundColor: '#25313C' }]}>
            <FlatList              
                data={this.props.items}
                renderItem={({item,index}) => this.renderAthletItem(item,index)}
                keyExtractor={(item, index) => index.toString()}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh.bind(this)}
                onEndReached={this.props.loadMore}
                onEndReachedThreshold={0.5}                
            />
        </View>
    );
  }
}

export default AthleteView
