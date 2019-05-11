import React, {Component} from 'react';
import {Keyboard,ScrollView,KeyboardAvoidingView,Platform, Dimensions,Animated,FlatList,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Styles from '../common/style';

const { styles } = Styles;

class BoardView extends Component {

  constructor(props) {
    super(props)
    this.state = {
        refreshing:false,
    }
  }  
  shouldComponentUpdate(nextProps) {
    return nextProps.items !== this.props.items
  }

  renderTeamItem(item,index)
  {
    var backColor = "#263440";   
    if (index % 2 == 1)
    {
        backColor = '#25313C';
    }      
    return(
      <TouchableOpacity onPress={()=>this.props.clickItem(item,index)}>
          <View>            
              <View style={{backgroundColor:backColor,padding:10}}>                
                  <Text style={[styles.whiteColor,{fontSize:14}]}>{item.name}</Text>                  
                  <View style={{flexDirection:'row',flexWrap:'wrap',height:35,alignItems:'center',marginTop:5}}>
                        <View style={{maxWidth:200,flexDirection:'row'}}>                            
                            {
                                item.athletes.profile_images?
                                item.athletes.profile_images.map((value,index) => (
                                    index == 0? <Image key={'ii' + value} style={{width:28,height:28,borderRadius:14}} source={{uri:value}}/>
                                    :<Image key={'ii' + value} style={{width:28,height:28,borderRadius:14,marginLeft:-10}} source={{uri:value}}/>
                                ))
                                :null
                            }                            
                        </View>
                        <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.props.clickTeamDetail(item,index)}>
                            <Text style={{color:'#246589',fontSize:12}}>{item.athletes.count?item.athletes.count:0} Athletes</Text>
                        </TouchableOpacity>
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
    //this.prop.reloading();
  }
  render() {
    return(
        <View style={[styles.scene, { backgroundColor: '#25313C' }]}>
            <FlatList              
                data={this.props.items}
                renderItem={({item,index}) => this.renderTeamItem(item,index)}
                keyExtractor={(item, index) => index.toString()}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh.bind(this)}
            />
        </View>
    );
  }
}

export default BoardView
