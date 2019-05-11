import React, {Component} from 'react';
import {Platform, CameraRoll,Animated,Dimensions,FlatList,TouchableWithoutFeedback,ScrollView,TouchableOpacity,StatusBar,View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import ActionSheet from 'react-native-actionsheet';
import Spinner from 'react-native-loading-spinner-overlay';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator,ViewPager} from 'rn-viewpager';
import Styles from '../common/style';
import {serviceGetTags,serviceGetTag,serviceSearch} from '../api/media/tag';
import {formatDate,getDay} from '../util/utils';
import CheckBox from 'react-native-check-box'
import RNFetchBlob from 'rn-fetch-blob'
import {Config} from '../doc/config';
var RNFS = require('react-native-fs');


const { styles } = Styles; 

const { width, height } = Dimensions.get('window');

var self= null;
export default class MediaLibraryScreen extends Component {
  constructor(props) {
    super(props);
    self = this; 
    var viewpager;
    var tagScroll;
    var dlgDownload
    const {state} = props.navigation;    
    this.state = {        
        isVisibleSpin:false,
        isVisibleSuccess:false,
        refreshing:false,
        tags:[],
        filterTags:[],
        selectedTag:0,
        bounceValue: new Animated.Value(0),
        isVisibleFilter:false,
        filterHeadOptions:[
            {name:"Images",isSelect:false,url:''},
            {name:"Videos",isSelect:false,url:''},
            {name:"GIF",isSelect:false,url:''}
        ],
        filterMedias:[],
        orgMedias:[],
        filterName:'',
        filterType:'image',
        fTags:'',
        downloadPath:'',
        downloadItem:null,
        pageNum:0
    }
    
  }
  componentDidMount()
  {
      this.setState({isVisibleSpin:true});
      this.webGetTags();
      this.webSearchInit('image')
      this.webSearchInit('video')
      this.webSearchInit('gif')
      this.webSearch();
      

  }
  webSearchInit(type)
  {
    serviceSearch('',type,this.state.fTags,1)
    .then(res=>{ 
        filters = this.state.filterHeadOptions;
        if (type == 'image')
        {
          filters[0].url = res[0].urls.medium
        }
        else if (type == 'video')
        {
          filters[1].url = res[0].urls.medium
        }
        else if (type == 'gif')
        {
          filters[2].url = res[0].urls.medium
        }
        this.setState({filterHeadOptions:filters});
    })
    .catch(err=>{        
        this.setState({isVisibleSpin:false});
    });
  }
  webSearch(filterType='',page=this.state.pageNum)
  {      
    var type = this.state.filterType;
    if (filterType != '')
        type = filterType;
    serviceSearch(this.state.filterName,type,this.state.fTags,page + 1)
    .then(res=>{ 
        this.setState({filterMedias:this.state.filterMedias.concat(res),orgMedias:this.state.orgMedias.concat(res),pageNum:this.state.pageNum + 1});
    })
    .catch(err=>{        
        this.setState({isVisibleSpin:false});
    });
  }
  webGetTag(id)
  {
    serviceGetTag(id)
    .then(res=>{        
        this.setState({filterMedias:res.media.items,orgMedias:res.media.items});
    })
    .catch(err=>{        
        this.setState({isVisibleSpin:false});
    });
  }
  webGetTags()
  {
    serviceGetTags()
    .then(res=>{
        for (i = 0;i < res.length;i++)
        {
            res[i].filterMedias = res[i].media.items;
            res[i].isSelect = false;
        }
        this.setState({tags:res,filterTags:res,isVisibleSpin:false});        
        //this.webGetTag(res[0].id);
    })
    .catch(err=>{
        this.setState({isVisibleSpin:false});
    });
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
  
  filterMedia(text)
  {   
      if (text == '')
      {
        var tag = this.state.filterTags[this.state.selectedTag]
        this.webSearch();
        //this.webGetTag(tag.id);        
        return;
      }
      this.setState({filterText:text});
      this.webSearch()
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
  handleRefresh()
  {
    self.setState({refreshing:true});
  }
  onTagSelet(value,index)
  {
      var types = ['image','video','gif'];
      txt = types[index]
      console.warn(txt);
      this.viewpager.setPage(index);
      this.setState({selectedTag:index,filterMedias:[],filterType:txt,pageNum:0});
      //this.webSearch(txt,0);
      //this.webGetTag(value.id)
  }
  renderTags()
  {      
    return (        
        this.state.filterHeadOptions.map((value,index) => (
            <TouchableOpacity key={"tag" + index} onPress={()=> this.onTagSelet(value,index)}>
                <View style={{margin:3}}>
                    <Image style={{width:(width - 18) / 3,height:(width - 18) / 3,borderRadius:20}} source={{uri:value.url}}/>
                    <View style={{position:'absolute',left:0,bottom:0,width:(width - 18) / 3,height:(width - 18) / 3,borderRadius:20,backgroundColor:'#000',opacity:0.5}}/>                
                    <Text style={{position:'absolute',left:0,right:0,textAlign:'center',bottom:10,color:'#fff',fontSize:18}}>{value.name}</Text>
                    {
                        index == this.state.selectedTag?
                        <View style={{position:'absolute',left:15,right:15,bottom:3,height:2,backgroundColor:'#fff',borderRadius:1}}/>
                        : null
                    }
                </View>
            </TouchableOpacity>                                
        ))        
    );
  }
  renderMediaItem(item,index)
  {
    return (
        <TouchableOpacity key={"media" + index} onLongPress={()=>this.onLongClickMedia(item,index)} onPress={()=> this.onMediaSelect(item,index)}>
            <View style={{width:width / 3,height:width / 3}}>
                <Image style={{position:'absolute',left:3,top:3,right:3,bottom:3}} source={{uri:item.urls.medium}}/>
            </View>
        </TouchableOpacity>
    );
  }

  onLongClickMedia(item,index)
  {
    this.setState({downloadItem:item});
    this.dlgDownload.show();
  }
  writeImageFile(path,data)
  {
    console.warn(data);

    RNFS.writeFile(path, data, 'base64')
    .then((success) => {
      console.warn('FILE WRITTEN!');
    })
    .catch((err) => {
      console.warn(err.message);
    });
  }
  onDownloadFile()
  {
    if (this.state.downloadItem == null) return;
    var item = this.state.downloadItem;
    let dirs = RNFetchBlob.fs.dirs
    if (Platform.OS === 'android')
    {
      var pathDir = dirs.DocumentDir;
      RNFetchBlob.config({
        path : pathDir + "/" + item.id + ".jpg"
      })
      .fetch('GET', item.urls.medium)
      .then((res) => {
          //console.warn(res);        
          CameraRoll.saveToCameraRoll(res.path()).then();
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
      
      })
    }
    else
    {
      //console.warn(item.urls.medium);
      CameraRoll.saveToCameraRoll(item.urls.medium,'photo').then(function(result){
        //console.warn('download success');
      });
    }
  }
  clickTagFilter(index)
  {
        var tags = this.state.tags;
        tags[index].isSelect = !tags[index].isSelect;
        var tagsString = '';
        for (i = 0;i < tags.length;i++)
        {
            if (tags[i].isSelect)
            {
                tagsString = tagsString + tags[i].name + ","
            }
        }
        if (tagsString != '')
        {
            tagsString = tagsString.substring(0,tagsString.length - 1);
        }        
        this.setState({fTags:tagsString});
        //this.filterTags();
  }  
  renderFilterTagOption()
  {
    return(
        this.state.tags.map((value,index) => (
            <View key={"filter_tag" + index} style={{flexDirection:'row',height:35}}>
                <CheckBox
                    style={{flex:2}}
                    textStyle={{color:'#888'}}
                    checkBoxColor={'#CAD6DC'}
                    checkedCheckBoxColor={'#5E9FE3'}
                    uncheckedCheckBoxColor={'#CAD6DC'}
                    onClick={()=>{ this.clickTagFilter(index)}}
                    isChecked={value.isSelect}
                    rightText={value.name + " (" + value.media.count + " total)"}
                />
            </View>
        ))
    );
  }
  onMediaSelect(value,index)
  {
    self.props.navigation.state.params.onMediaSelect(value);
    self.props.navigation.goBack();
  }
  loadMore()
  {
    console.warn('load more');
    self.webSearch();
  }
  renderMedias()
  {
      
      return(
            this.state.filterHeadOptions.map((value,index) => (
                <View key={"medialist" + index}>
                    {
                      this.state.filterMedias.length > 0 ?
                      <FlatList              
                        data={this.state.filterMedias}
                        renderItem={({item,index}) => this.renderMediaItem(item,index)}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={1.0}
                    />
                    :
                    <View style={{flex:1}}>
                      <Text style={{color:'#fff',margin:20,textAlign:'center',fontSize:16}}>No {this.state.filterType}</Text>
                    </View>
                    }
                    
                </View>
            ))          
      );
  }
  closeFilter()
  {
    var toValue = 0;
    Animated.spring(
        this.state.bounceValue,
        {
          toValue: toValue,
          velocity: 3,
          tension: 2,
          friction: 8,
        }
    ).start();    
    this.setState({isVisibleFilter:false});
  } 
  openFilter()
  {
      var toValue = height / 2 * (-1);
      Animated.spring(
        this.state.bounceValue,
        {
          toValue: toValue,
          velocity: 3,
          tension: 2,
          friction: 8,
        }
      ).start();
  
      this.setState({isVisibleFilter:true});
  }
  pageSelected(index)
  {      
      
      var types = ['image','video','gif'];
      txt = types[index.position]
      this.setState({selectedTag:index.position,filterMedias:[],filterType:txt,pageNum:0});
      this.webSearch(txt);
  }
  applyFilter()
  {
    if (this.state.fTags == '' && this.state.filterType == '')
    {
      var tag = this.state.filterTags[this.state.selectedTag]
      //this.webGetTag(tag.id);
    }
    else
    {
      this.webSearch();      
    }
    this.closeFilter();
    
  }
  submitOk()
  {
    self.setState({isVisibleSuccess:false});
  }

  clickMenuSelect(index)
  {      
      if (index == 0)
      {
        this.onDownloadFile();
        //this.props.navigation.navigate('MediaLibraryScreen',{onMediaSelect: (info) => this.callbackMediaLib(info)});
      }        
  }


  render() {
    return (
        <View style={[styles.bg,styles.flexFull]}>        
            <StatusBar hidden={true} />
            <View style={[styles.vwTopBar]}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{marginLeft:10,width:35,height:35,padding:10}} onPress={()=> self.props.navigation.goBack()}>
                        <Image style={[styles.img15]} source={require('../assets/back-512.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[{position:'absolute',alignItems:'center',paddingTop:20}]}>
                    <TouchableOpacity>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={[styles.textColorBlue,{fontSize:18,textAlign:'center'}]}>Media Library</Text>                            
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TextInput style={[styles.inputSearch,{flex:1}]} placeholder="Search" placeholderTextColor="#8D9196" onChangeText={(text) => this.filterMedia(text)}/>
                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',padding:5}} onPress={()=> this.openFilter()}>
                    <Image style={{width:22,height:22}} source={require('../assets/ic_filter.png')}/>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor:'#323E49',height:1}}></View>
            <View>
                <ScrollView ref={ref => this.tagScroll = ref}  horizontal= {true}>
                    <View style={{flexDirection:'row'}}>
                        {this.renderTags()}
                    </View>
                </ScrollView>
            </View>
            <View style={{flex:1}}>
                <ViewPager ref={ref => this.viewpager = ref}  style={{flex:1, paddingTop:20}}
                onPageSelected={(index) => this.pageSelected(index)}>
                    {this.renderMedias()}                    
                </ViewPager>
            </View>
            {
                this.state.isVisibleFilter?
                <View style={{position:'absolute',left:0,top:0,right:0,bottom:0,backgroundColor:'#000',opacity:0.4}}>
                    <TouchableWithoutFeedback onPress={()=> this.closeFilter()}> 
                        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0}}>
                        
                        </View>
                    </TouchableWithoutFeedback>                    
                </View>
                :null
            }
            <Animated.View
                        style={{transform: [{translateY: this.state.bounceValue}],position: "absolute",left: 0,right: 0,bottom:height / 2 * (-1),backgroundColor: "#DDE7EE",height: height / 2,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <View>
                            <View style={{justifyContent:'flex-end',flexDirection:'row',marginTop:10}}>
                                <TouchableOpacity onPress={()=> this.applyFilter()}>
                                    <Text style={{textAlign:'center',color:'#287AA5',width:100,height:35}}>Apply</Text>                            
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={{marginLeft:20,marginRight:20,marginBottom:60,marginTop:10}}>
                                <View>
                                    {this.renderFilterTagOption()}
                                </View>                            
                            </ScrollView>
                        </View>
            </Animated.View>

            <ActionSheet
                ref={o => this.dlgDownload = o}                
                options={['Save media','Cancel']}
                cancelButtonIndex={1}                
                onPress={(index) => { this.clickMenuSelect(index) }}
            />

            {this.renderLoading()}
        </View>
    );
  }
}