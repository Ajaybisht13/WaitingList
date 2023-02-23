import { StyleSheet, Text, View, ImageBackground, SafeAreaView, Image, TextInput, TouchableOpacity, Dimensions, Pressable, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalAZtext, validateNumber, userEmail, checkPhone, userPassword } from '../Validation';
import axios from 'axios';
import { basesUrl } from '../../App';
import { ScrollView } from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import InternetCheck from '../InternetConnection/InternetCheck';
import NetInfo from "@react-native-community/netinfo";


export default class Signin extends Component {

  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
    this.state = {
      buttonAction: false,
      username: '',
      usernameerror: false,
      passworderror: false,
      password: '',
      text: '',
      width: "",
      signup: false,
      fullname: "",
      fullnameerror: false,
      email: "",
      emailerror: false,
      phoneno: "",
      phoneerror: false,
      repassword: "",
      repassworderror: false,
      checkemails: null,
      checkphone: null,
      businessid: 0,
      apierrormessage: "",
      apisuccessstatus: false,
      showPassword: true,
      registerPasswordshow: true,
      connection_status: false,
      emailempty: false,
      phoneempty: false,
      registerSuccess: false
    }
  }

  componentDidMount = async () => {
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
    let time = new Date();
    let width = Dimensions.get("screen").width;
    time.setHours(time.getHours() + 5)
    time = new Date(time)
    time.setMinutes(time.getMinutes() + 30)
    this.setState({ width: width })
    DeviceInfo.getUniqueId().then((deviceId) => {
      this.setState({ deviceId: deviceId })
    });
  }


  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  _handleConnectivityChange = (state) => {
    this.setState({
      connection_status: state.isConnected,
    })
  }


  submit = () => {
    if (this.state.username == "") {
      this.setState({ usernameerror: true })
    }
    if (this.state.password == "") {
      this.setState({ passworderror: true })
    }
    if (this.state.username != "" && this.state.password != "") {
      this.setState({
        buttonAction: true
      }, () => {
        let data = {
          "email": this.state.username,
          "password": this.state.password,
          "deviceId": this.state.deviceId
        }
        axios.post(basesUrl + "identity/token", data).then((res) => {
          if (res.data.succeeded != true) {
            Keyboard.dismiss();
            this.setState({ apisuccessstatus: true, buttonAction: false })
            this.setState({ apierrormessage: res.data.message })
          } else {
            Keyboard.dismiss();
            AsyncStorage.setItem("jwtoken", res.data.data.jwToken)
            AsyncStorage.setItem("businessId", res.data.data.businessesId.toString())
            this.setState({ apisuccessstatus: true, registerSuccess: true })
            // this.setState({ apierrormessage: "Login successfully" })
            this.setState({ apierrormessage: "", buttonAction: true })
            this.setState({ signup: false })
            setTimeout(() => {
              this.setState({ apisuccessstatus: false, registerSuccess: false })
              this.setState({ apierrormessage: "" })
              if (res.data.data.businessesId != 0) {
                this.props.navigation.navigate("Home")
              } else {
                this.props.navigation.navigate("Companyinfo")
              }
            }, 1000)
          }
        })
      });
    }
  }



  register = async () => {
    let name = normalAZtext(this.state.fullname)
    let emails = userEmail(this.state.email)
    let phone = checkPhone(this.state.phoneno)
    let reps = userPassword(this.state.repassword)
    if (name == false) {
      this.setState({ fullnameerror: true })
    }
    if (this.state.email != "") {
      if (emails == false) {
        this.setState({ emailerror: true })
      }
    } else {
      this.setState({ emailempty: true })
    }
    if (this.state.phoneno != "") {
      if (phone == false) {
        this.setState({ phoneerror: true })
      }
    } else {
      this.setState({ phoneempty: true })
    }

    if (reps == false) {
      this.setState({ repassworderror: true })
    }
    if (name == true && emails == true && phone == true && reps == true) {
      let datas = {
        "businessesId": 0,
        "name": this.state.fullname,
        "email": this.state.email,
        "phoneNumber": this.state.phoneno,
        "password": this.state.repassword,
        "confirmPassword": this.state.repassword,
        "roleId": 0
      }
      await axios.post(basesUrl + "identity/register", datas).then((response) => {
        if (response.data.succeeded != true) {
          this.setState({ apisuccessstatus: true })
          this.setState({ apierrormessage: response.data.message })

        } else {
          AsyncStorage.setItem("userEmail", this.state.email);
          AsyncStorage.setItem("userPhone", this.state.phoneno);
          this.setState({ fullname: "", email: "", phoneno: "", repassword: "" })
          this.setState({ apisuccessstatus: true, registerSuccess: true, checkemails: null, checkphone: null })
          this.setState({ apierrormessage: "Register successfully" })

          this.setState({ signup: false })
          setTimeout(() => {
            this.setState({ apisuccessstatus: false, registerSuccess: false })
            this.setState({ apierrormessage: "" })
          }, 2000)
        }
      })
    }

  }

  checkemail = async (text) => {
    let emaichecker = userEmail(text)

    if (emaichecker == true) {
      await axios.get(basesUrl + "identity/ValidateEmailId?emailId=" + text).then((res) => {
        this.setState({ checkemails: res.data.succeeded })
      })
    } else {
      if (emaichecker == false) {
        this.setState({ checkemails: null })
      }
      if (text == "") {
        this.setState({ checkemails: null })
      }

    }
  }
  checkcontact = async (text) => {

    let phone = checkPhone(text);
    if (phone == true) {
      await axios.get(basesUrl + "identity/ValidateContactNo?contactNo=" + text).then((res) => {
        this.setState({ checkphone: res.data.succeeded })
      })
    } else {
      if (text == "") {
        this.setState({ checkphone: null })
      }
      this.setState({ checkphone: null })
    }

  }

  render() {

    return (
      <View style={{ height: "100%" }}>
        {
          this.state.connection_status ?
            <ImageBackground
              source={require('../Assets/login-bg01.jpg')}
              style={{
                flex: 1, backgroundColor: '#EDEDF4',
                width: null,
                height: null,
              }}
            >
              {
                this.state.apisuccessstatus == true ? (  //#067655
                  <View style={{ marginTop: Platform.OS == "ios" && this.state.width < 769 ? "8%" : 0, backgroundColor: this.state.registerSuccess == true ? this.state.buttonAction == true ? "transparent" : "#067655" : this.state.buttonAction == true ? "transparent" : "#FF0000", justifyContent: 'center', alignItems: "center", }}>
                    <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>{this.state.apierrormessage}</Text>
                  </View>) : null
              }
              <ScrollView keyboardShouldPersistTaps="always">
                <Pressable onPress={() => Keyboard.dismiss()}>
                  <View style={{ marginTop: this.state.width < 769 ? 20 : 60 }} >
                    <View style={{
                      height: '100%', alignItems: 'center', marginTop:
                        Platform.OS == "ios" ? 20 : 0
                    }}>
                      <Image source={require('../Assets/starbuck-logo.png')} style={{ width: this.state.width < 769 ? 145 : 163, height: this.state.width < 769 ? 147 : 165 }} />
                      <View style={{ marginTop: this.state.width < 769 ? 20 : 32, backgroundColor: '#010101', width: this.state.width < 769 ? 331 : 419, paddingHorizontal: 36, borderRadius: 20, paddingVertical: 20, }}>
                        {
                          this.state.signup == true ? (
                            <View style={{ marginTop: this.state.width < 769 ? 0 : 12, marginBottom: this.state.width < 769 ? 0 : 33 }}>
                              <Text style={{ fontSize: this.state.width < 769 ? 23 : 30, textAlign: 'center', marginBottom: 15, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}> Sign Up</Text>
                              <View style={{ flexDirection: "row", backgroundColor: '#ffffff', height: 49, justifyContent: "space-between", alignContent: 'center', borderRadius: 7, marginTop: 10, paddingHorizontal: 15, }}>
                                <TextInput
                                  placeholder='Full Name'
                                  placeholderTextColor={'#000000'}
                                  value={this.state.fullname}
                                  maxLength={20}
                                  selectionColor={'#067655'}
                                  onChangeText={(text) => { this.setState({ fullname: text, fullnameerror: false, apisuccessstatus: false }) }
                                  }
                                  style={{ flex: 1, fontFamily: 'Poppins-Regular', color: '#000000', fontSize: this.state.width < 769 ? 15 : 24, padding: 0, paddingBottom: 0, paddingTop: 0, height: '100%', width: "80%" }}
                                />
                                <Pressable style={{ height: 49, width: "20%", justifyContent: "center", alignItems: "flex-end" }}>
                                  {
                                    this.state.fullnameerror == true ? (<Image source={require('../Assets/red-code.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : null
                                  }
                                </Pressable>
                              </View>
                              {
                                this.state.fullnameerror == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2 }}>
                                  <Text style={{ color: 'white' }}>Full Name is required</Text>
                                </View>) : null
                              }

                              <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', height: 49, justifyContent: "space-between", alignContent: 'center', borderRadius: 7, marginTop: 10, paddingHorizontal: 15 }}>
                                <TextInput
                                  placeholder='Email Id'
                                  placeholderTextColor={'#000000'}
                                  value={this.state.email}
                                  selectionColor={'#067655'}
                                  onChangeText={(text) => { this.setState({ email: text, emailerror: false, apisuccessstatus: false, emailempty: false }), this.checkemail(text) }}
                                  style={{ fontFamily: 'Poppins-Regular', color: '#000000', fontSize: this.state.width < 769 ? 15 : 24, padding: 0, paddingBottom: 0, paddingTop: 0, height: '100%', width: "80%" }}
                                />
                                <Pressable style={{ height: 49, width: "20%", justifyContent: "center", alignItems: "flex-end" }}>
                                  {
                                    this.state.checkemails != null ? this.state.checkemails == true ? (<Image source={require('../Assets/Iconawesome-check-circle.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : (<Image source={require('../Assets/red-code.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : null
                                  }
                                </Pressable>
                              </View>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {
                                  this.state.checkemails != null ? this.state.checkemails == false ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                    <Text style={{ color: 'white' }}>Email already exists</Text>
                                  </View>) : null : null
                                }
                                {
                                  this.state.emailerror == true ? (
                                    <View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                      <Text style={{ color: 'white' }}>Please enter correct email id</Text>
                                    </View>) : this.state.emailempty == true ? (
                                      <View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                        <Text style={{ color: 'white' }}>Email required</Text>
                                      </View>) : null
                                }
                              </View>
                              <View style={{ flexDirection: "row", backgroundColor: '#ffffff', height: 49, justifyContent: "space-between", alignContent: 'center', borderRadius: 7, marginTop: 10, paddingHorizontal: 15 }}>
                                <TextInput
                                  placeholder='Phone No.'
                                  placeholderTextColor={'#000000'}
                                  value={this.state.phoneno}
                                  selectionColor={'#067655'}
                                  keyboardType='numeric'
                                  maxLength={10}
                                  onChangeText={(text) => { this.setState({ phoneno: text, phoneerror: false, apisuccessstatus: false, phoneempty: false }), this.checkcontact(text) }}
                                  style={{ flex: 1, fontFamily: 'Poppins-Regular', color: '#000000', fontSize: this.state.width < 769 ? 15 : 24, padding: 0, paddingBottom: 0, paddingTop: 0, height: '100%', width: "80%" }}
                                />
                                <Pressable style={{ height: 49, width: "20%", justifyContent: "center", alignItems: "flex-end" }}>
                                  {
                                    this.state.checkphone != null ? this.state.checkphone == true ? (<Image source={require('../Assets/Iconawesome-check-circle.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : (<Image source={require('../Assets/red-code.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : null
                                  }
                                </Pressable>
                              </View>
                              <View>
                                {
                                  this.state.checkphone != null ? this.state.checkphone == false ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2 }}>
                                    <Text style={{ color: 'white' }}>Phone no. already exists</Text>
                                  </View>) : null : null
                                }
                                <View>
                                  {
                                    this.state.phoneerror == true ? (
                                      <View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                        <Text style={{ color: 'white' }}>Please enter correct phone no.</Text>
                                      </View>) : this.state.phoneempty == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                        <Text style={{ color: 'white' }}>Phone no required</Text>
                                      </View>) : null
                                  }
                                </View>
                              </View>
                              <View style={{ flexDirection: "row", backgroundColor: '#ffffff', height: 49, justifyContent: "space-between", alignContent: 'center', borderRadius: 7, marginTop: 10, paddingHorizontal: 15, }}>
                                <TextInput
                                  placeholder='Password'
                                  placeholderTextColor={'#000000'}
                                  value={this.state.repassword}
                                  // multiline={true}
                                  // numberOfLines={1}
                                  // blurOnSubmit={true}
                                  selectionColor={'#067655'}
                                  secureTextEntry={this.state.registerPasswordshow}
                                  onChangeText={(text) => this.setState({ repassword: text, repassworderror: false, apisuccessstatus: false })}
                                  style={{ fontFamily: 'Poppins-Regular', color: '#000000', fontSize: this.state.width < 769 ? 15 : 24, padding: 0, paddingBottom: 0, paddingTop: 0, height: '100%', width: "80%" }}
                                />
                                <Pressable style={{ height: 49, width: "20%", justifyContent: "center", alignItems: "flex-end" }} onPress={() => {
                                  if (this.state.repassword != "") {
                                    this.setState({ registerPasswordshow: !this.state.registerPasswordshow })
                                  }
                                }}>
                                  {
                                    this.state.registerPasswordshow == false ? (<Image source={require('../Assets/eyeopen.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : (<Image source={require('../Assets/eyeclose.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />)
                                  }

                                </Pressable>
                              </View>
                              {
                                this.state.repassworderror == true ? this.state.repassword == "" ? (
                                  <View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2 }}>
                                    <Text style={{ color: 'white' }}>Password is required</Text>
                                  </View>
                                ) : (
                                  <View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2 }}>
                                    <Text style={{ color: 'white' }}>Password can contain one capital letter and numbers</Text>
                                  </View>
                                ) : null
                              }
                              <TouchableOpacity
                                onPress={() => this.register()}
                                style={{ width: '100%', paddingVertical: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#067655', borderRadius: 127, marginVertical: 10, marginTop: 20 }}>
                                <Text style={{ color: "#FFFFFF", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-SemiBold' }}>Register</Text>
                              </TouchableOpacity>
                              <View style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "grey" }}>Already have an account <Text onPress={() => this.setState({ signup: false, fullnameerror: false, emailerror: false, phoneerror: false, repassworderror: false, fullname: "", email: "", phoneno: "", repassword: "", apisuccessstatus: false, phoneerror: false, phoneempty: false, checkphone: null, emailerror: false, emailempty: false, checkemails: null })} style={{ color: "#067655", fontSize: this.state.width < 769 ? 14 : 20, fontFamily: 'Poppins-SemiBold' }}>Sign In</Text></Text>
                              </View>
                            </View>
                          ) : (
                            <ScrollView>
                              <View style={{ marginTop: this.state.width < 769 ? 0 : 12, marginBottom: this.state.width < 769 ? 0 : 33 }}>
                                <Text style={{ fontSize: this.state.width < 769 ? 23 : 30, textAlign: 'center', marginBottom: 15, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}> Sign In</Text>
                                <View style={{ backgroundColor: '#ffffff', height: 49, justifyContent: 'center', alignContent: 'center', borderRadius: 7, marginTop: 10, paddingHorizontal: 15, }}>
                                  <TextInput
                                    placeholder='Username'
                                    placeholderTextColor={'#000000'}
                                    value={this.state.username}
                                    selectionColor={'#067655'}
                                    onChangeText={(text) => { this.setState({ username: text, usernameerror: false, apisuccessstatus: false }) }
                                    }
                                    style={{ flex: 1, fontFamily: 'Poppins-Regular', color: '#000000', fontSize: this.state.width < 769 ? 15 : 24, padding: 0, paddingBottom: 0, paddingTop: 0, height: '100%', }}
                                  />

                                </View>
                                {
                                  this.state.usernameerror == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                    <Text style={{ color: 'white' }}>Username required</Text>
                                  </View>) : null
                                }
                                {/* {
                        this.state.usernameerror == true ? (<Text style={{color:'red'}}>Enter Valid Username</Text>):null
                      } */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: '#ffffff', height: 49, marginTop: 20, paddingHorizontal: 15, alignItems: 'center', borderRadius: 7 }}>
                                  <TextInput
                                    placeholder='Password'
                                    placeholderTextColor={'#000000'}
                                    value={this.state.password}
                                    // multiline={true}
                                    // numberOfLines={1}
                                    blurOnSubmit={true}
                                    secureTextEntry={this.state.showPassword}
                                    selectionColor={'#067655'}
                                    onChangeText={(text) => this.setState({ password: text, passworderror: false, apisuccessstatus: false })}
                                    style={{ fontFamily: 'Poppins-Regular', color: '#000000', fontSize: this.state.width < 769 ? 15 : 24, padding: 0, paddingBottom: 0, paddingTop: 0, height: '100%', width: "80%" }}
                                  />
                                  <Pressable style={{ height: 49, width: "20%", justifyContent: "center", alignItems: "flex-end" }} onPress={() => {
                                    if (this.state.password != "") {
                                      this.setState({ showPassword: !this.state.showPassword })
                                    }
                                  }}>
                                    {
                                      this.state.showPassword == false ? (<Image source={require('../Assets/eyeopen.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />) : (<Image source={require('../Assets/eyeclose.png')} style={{ width: this.state.width < 769 ? 20 : 30, height: this.state.width < 769 ? 20 : 30 }} />)
                                    }

                                  </Pressable>
                                </View>
                                {
                                  this.state.passworderror == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, width: "100%" }}>
                                    <Text style={{ color: 'white' }}>Password required</Text>
                                  </View>) : null
                                }

                                {/* {
                        this.state.passworderror == true ? (<Text style={{color:'red'}}>Enter Valid Password</Text>):null
                      } */}
                                {
                                  this.state.buttonAction == true ? null :
                                    <View>
                                      {
                                        this.state.apisuccessstatus == true ? (  //#067655
                                          <View style={{ marginTop: this.state.width < 769 ? 5 : 5, backgroundColor: this.state.registerSuccess == true ? "" : "#FF0000", justifyContent: 'center', alignItems: "center", borderRadius: 5 }}>
                                            <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-SemiBold' }}>{this.state.apierrormessage}</Text>
                                          </View>) : null
                                      }
                                    </View>
                                }
                                {
                                  this.state.buttonAction == true ?
                                    <View
                                      onPress={() => this.submit()}
                                      style={{ width: '100%', paddingVertical: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#067655', borderRadius: 127, marginVertical: 10, marginTop: 20 }}>
                                      <Text style={{ color: "#FFFFFF", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-SemiBold' }}>Please wait ...</Text>
                                    </View> :
                                    <TouchableOpacity
                                      onPress={() => this.submit()}
                                      style={{ width: '100%', paddingVertical: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#067655', borderRadius: 127, marginVertical: 10, marginTop: 20 }}>
                                      <Text style={{ color: "#FFFFFF", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-SemiBold' }}>Submit</Text>
                                    </TouchableOpacity>
                                }

                                <View style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                                  <Text style={{ color: "grey" }}>Don't have an account? <Text onPress={() => this.setState({ signup: true, passworderror: false, usernameerror: false, apisuccessstatus: false, password: "", username: "" })} style={{ color: "#067655", fontSize: this.state.width < 769 ? 14 : 20, fontFamily: 'Poppins-SemiBold' }}>Sign up</Text></Text>
                                </View>
                              </View></ScrollView>)
                        }
                      </View>
                    </View>

                  </View>
                </Pressable>
              </ScrollView>
            </ImageBackground> :
            <View>
              <InternetCheck />
            </View>
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13493A'
  },
  input: {
    height: 40,
    width: 250,
    borderRadius: 5,
    backgroundColor: '#598176',
    color: 'white',
    marginTop: 30,
    textAlign: 'center',
    alignSelf: 'center'
  }
});