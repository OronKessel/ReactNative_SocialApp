import React, {Component} from 'react';
import {KeyboardAvoidingView,Platform, CheckBox,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import Dialog from "react-native-dialog";
import Spinner from 'react-native-loading-spinner-overlay';
import Permissions from 'react-native-permissions'
import {Config} from '../doc/config';
import DefaultPreference from 'react-native-default-preference';
import Styles from '../common/style';
import {serviceLogin,serviceRequestPassword} from '../api/organization/user';

const { styles } = Styles;

var self= null;
export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    var timer;
    self = this;
    this.state = {
      //userEmail: 'non.admin@stackedsports.com',
      //userEmail: 'info@stackedsports.com',
      //userPw: 'Neversaydie27!',
      userEmail: '',
      userPw: '',
      forgetEmail:'',
      errorTitle:'Error',
      errorContent:'',
      isVisibleErr:false,
      isVisibleSpin:false,
      isVisibleForget:false,
      userInfo:{}
    }

  }
  componentDidMount()
  {
    this._requestPermission();
  }
  _requestPermission = () => {
    Permissions.request('camera').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
    })
    Permissions.request('photo').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
    })
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


  login()
  {
    if (this.state.userEmail == '')
    {
      this.setState({
        errorTitle:'Error',
        errorContent:'Please fill email address.',
        isVisibleErr:true
      });
      return;
    }
    if (this.state.userPw == '')
    {
      this.setState({
        errorTitle:'Error',
        errorContent:'Please fill password.',
        isVisibleErr:true
      });
    }
    this.setState({isVisibleSpin:true});
    serviceLogin(this.state.userEmail,this.state.userPw)
    .then(res=>{
      this.setState({isVisibleSpin:false,userInfo:res});
      Config.AuthToken = res.token;
      DefaultPreference.setMultiple({user:this.state.userEmail,password:this.state.userPw}).then(function(values) 
      {
        this.props.navigation.navigate('InboxScreen',{userInfo:res});
            
      })
      .catch(err=>{
        this.props.navigation.navigate('InboxScreen',{userInfo:res});
      });
      
    })
    .catch(err=>{
        this.setState({isVisibleSpin:false});
        this.setState({
          errorTitle:'Error',
          errorContent:'SignIn Failure, Please try again',
          isVisibleErr:true
        });
    });
  }
  forgetPassword()
  {
    this.setState({
      isVisibleForget:true
    });
  }
  erroOK()
  {
    this.setState({
      isVisibleErr:false
    });
  }
  submitEmail()
  {
    if (this.state.forgetEmail == '')
    {
      return;
    }
    this.setState({isVisibleSpin:true});
    serviceRequestPassword(this.state.forgetEmail)
    .then(res=>{
      this.setState({isVisibleSpin:false});
      this.setState({
        errorTitle:'Thanks!',
        errorContent:"An email was sent to this address containing reset password instructions",
        isVisibleErr:true
      });
    })
    .catch(err=>{
        this.setState({isVisibleSpin:false});
        this.setState({
          errorTitle:'Error',
          errorContent:"Can't find User",
          isVisibleErr:true
        });
    });
    this.setState({
      isVisibleForget:false
    });
  }
  forgetCancel()
  {
    this.setState({
      isVisibleForget:false
    });
  }
  render() {
    return (
      <KeyboardAvoidingView style={[styles.bg,styles.flexFull]} behavior="padding" enabled>
        <StatusBar hidden={true} />
        <Image style={[styles.bgImage,{position:'absolute'}]} source={require('../assets/login-background.png')}/>
        <View style={styles.vwLoginFrame}>
            <Image style={styles.loginLogo} source={require('../assets/login_logo.png')}/>
        </View>
        <View style={styles.vwLoginFrame}>
            <TextInput style={[styles.inputForm,styles.widthFullMargine20,{paddingLeft:10}]} value={this.state.userEmail} keyboardType={"email-address"} placeholder="Email Address" onChangeText={(text) => this.setState({userEmail:text})}/>
            <TextInput secureTextEntry={true} value={this.state.userPw} style={[styles.inputForm,styles.widthFullMargine20,{marginTop:1,paddingLeft:10}]} placeholder="Password" onChangeText={(text) => this.setState({userPw:text})}/>
            <TouchableOpacity onPress={()=> this.login()}>
                <Text style={[styles.btnPrimary,styles.widthFullMargine20,styles.whiteColor,{marginTop:5}]}>Sign In</Text>
            </TouchableOpacity>
            <View style={[styles.widthFullMargine20,{alignItems:'flex-end'}]}>
              <TouchableOpacity onPress={()=> this.forgetPassword()}>
                  <Text style={[{color:'#768189',marginTop:10}]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
        </View>
        <Dialog.Container visible={this.state.isVisibleForget}>
          <Dialog.Title>Reset Password</Dialog.Title>
          <Dialog.Description>
            Please enter your email address
          </Dialog.Description>
          <Dialog.Input value={this.state.forgetEmail} style={{borderWidth:1,borderColor:'#cccccc'}} onChangeText={(text) => this.setState({forgetEmail:text})}/>
          <Dialog.Button label="Cancel" onPress={()=> this.forgetCancel()}/>
          <Dialog.Button label="OK" onPress={()=> this.submitEmail()}/>
        </Dialog.Container>


        <Dialog.Container visible={this.state.isVisibleErr}>
          <Dialog.Title>{this.state.errorTitle}</Dialog.Title>
          <Dialog.Description>
            {this.state.errorContent}
          </Dialog.Description>
          <Dialog.Button label="OK" onPress={()=> this.erroOK()}/>
        </Dialog.Container>
        {this.renderLoading()}
      </KeyboardAvoidingView>
    );
  }
}
