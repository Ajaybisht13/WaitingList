import { Text, View, Image, TouchableOpacity, Pressable, Dimensions, Modal, Platform } from 'react-native'
import React, { Component } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { basesUrl } from '../../App';
import axios from 'axios';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";


export default class Navbar extends Component {

  NetInfoSubscribtion = null;

  constructor() {
    super();
    this.state = {
      width: "",
      businessId: 0,
      modaladd: false,
      companyLogo: "",
      connection_status: false,
    }
  }

  componentDidMount = async () => {
    // this.props.navigation.addListener('focus', async () => {
    //   let ss = await AsyncStorage.getItem("businessId");
    //   this.setState({
    //     businessId: ss,
    //   })
    //   if (ss != 0) {
    //     this.update();
    //   }
    // });
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
    let ss = await AsyncStorage.getItem("businessId");
    this.setState({
      businessId: parseInt(ss)
    }, () => {
      if (this.state.businessId != 0) {
        this.update();
      }
    })
    let deviceWidth = Dimensions.get("screen").width
    this.setState({ width: deviceWidth })
  }

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  _handleConnectivityChange = (state) => {
    this.setState({
      connection_status: state.isConnected,
    })
  }

  update = async () => {
    let businessesId = this.state.businessId;
    let token = await AsyncStorage.getItem("jwtoken")
    console.log(token, "dkjfjdsf");
    await axios.get(basesUrl + "v1/Businesses/GetBusinessByID?Id=" + businessesId, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json'
      }
    }).then((reuslt) => {
      console.log("nav bar response", reuslt.data.data);
      this.setState({
        businessType: reuslt.data.data.businessType.name,
        image: reuslt.data.data.imagePath == null || reuslt.data.data.imagePath == undefined ? null : reuslt.data.data.imagePath.replace(/\\/g, "/"),
      })
    })
  }

  waitForma = () => {
    if (this.state.businessId != 0) {
      this.props.navigation.navigate("Waitlistform")
    } else {
      this.setState({ modaladd: true })
    }
  }


  businessTim = () => {
    if (this.state.businessId != 0) {
      this.props.navigation.navigate("Timing")
    } else {
      this.setState({ modaladd: true })
    }
  }

  businessHist = () => {
    if (this.state.businessId != 0) {
      this.props.navigation.navigate("History")
    } else {
      this.setState({ modaladd: true })
    }
  }

  render() {
    return (
      <View style = {{height :"100%"}}> 
        {
          this.state.connection_status ?
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', opacity: 0.9, paddingTop: this.state.width < 769 ? 0 : 15 }}>
              <ScrollView contentContainerStyle={{ padding: 15 }}>
                <TouchableOpacity
                  style={{ width: this.state.width < 769 ? 25 : 36, height: this.state.width < 769 ? 25 : 36, textAlign: 'right', alignSelf: 'flex-end', marginTop: Platform.OS == "android" ? 20 : 30 }}
                  onPress={() => this.props.navigation.navigate("Home")}
                >
                  <Image source={require('../Assets/ico-close.png')} style={{ width: "100%", height: '100%' }} onPress={() => this.props.navigation.navigate("Home")} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: this.state.width < 769 ? 0 : 40 }}>
                  <Image source={this.state.businessId == 0 || this.state.image == null ? require('../Assets/companyLogo.png') : { uri: "http://apiwaitlist.nubiz.co.in/" + this.state.image }} style={{ width: this.state.width < 769 ? 120 : 150, height: this.state.width < 769 ? 121 : 152, borderRadius: 100 }} />
                  <View style={{ marginTop: this.state.width < 769 ? 14 : 24, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: this.state.width < 769 ? 26 : 36, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>Starbucks Corporation</Text>
                    <Text style={{ fontSize: this.state.width < 769 ? 18 : 18, color: '#3B3B3B', fontFamily: 'OpenSans-Regular' }}>{this.state.businessType}</Text>
                  </View>
                  <View style={{ borderWidth: 0.7, alignSelf: "center", width: "97%", borderColor: "#000000", marginTop: this.state.width < 769 ? 15 : 30 }}></View>
                  <Pressable
                    onPress={() => this.props.navigation.navigate("Companyinfo")}
                    style={{ marginTop: this.state.width < 769 ? 15 : 17, justifyContent: 'center', alignItems: 'center', textAlign: "center" }}>
                    <Text style={{ fontSize: this.state.width < 769 ? 20 : 24, color: '#3B3B3B', fontFamily: 'OpenSans-SemiBold' }}>Company Information</Text>
                    <Text style={{ fontSize: this.state.width < 769 ? 15 : 18, color: '#3B3B3B', marginTop: 12, opacity: 0.9, fontFamily: 'OpenSans-Regular', textAlign: "center" }}>Manage company details (Logo, Address, contact details, GST, etc.)</Text>
                  </Pressable>
                  <View style={{ borderWidth: 0.5, alignSelf: "center", width: "97%", borderColor: "#707070", marginTop: this.state.width < 769 ? 8 : 14 }}></View>
                  <Pressable
                    onPress={() => this.waitForma()}
                    style={{ marginTop: this.state.width < 769 ? 14 : 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: this.state.width < 769 ? 20 : 24, color: '#3B3B3B', fontFamily: 'OpenSans-SemiBold' }}>Manage Waitlist Form</Text>
                    <Text style={{ fontSize: this.state.width < 769 ? 15 : 18, color: '#3B3B3B', marginTop: 12, opacity: 0.9, fontFamily: 'OpenSans-Regular', textAlign: "center" }}>Decide how much information you need from your customers.</Text>
                  </Pressable>
                  <View style={{ borderWidth: 0.5, alignSelf: "center", width: "97%", borderColor: "#707070", marginTop: this.state.width < 769 ? 8 : 14 }}></View>
                  <Pressable
                    onPress={() => this.businessTim()}
                    style={{ marginTop: this.state.width < 769 ? 14 : 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: this.state.width < 769 ? 20 : 24, color: '#3B3B3B', fontFamily: 'OpenSans-SemiBold' }}>Business Timing</Text>
                    <Text style={{ fontSize: this.state.width < 769 ? 15 : 18, color: '#3B3B3B', marginTop: 12, opacity: 0.9, fontFamily: 'OpenSans-Regular', textAlign: "center" }}>Optimised for Reservations and Parties or Groups</Text>
                  </Pressable>
                  <View style={{ borderWidth: 0.5, alignSelf: "center", width: "97%", borderColor: "#707070", marginTop: this.state.width < 769 ? 8 : 14 }}></View>
                  <Pressable
                    onPress={() => this.businessHist()}
                    style={{ marginTop: this.state.width < 769 ? 14 : 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: this.state.width < 769 ? 20 : 24, color: '#3B3B3B', fontFamily: 'OpenSans-SemiBold' }}>Waitlist History</Text>
                    <Text style={{ fontSize: this.state.width < 769 ? 15 : 18, color: '#3B3B3B', marginTop: 12, opacity: 0.9, fontFamily: 'OpenSans-Regular', textAlign: "center" }}>Manage purchases, subscriptions, settings, and restrictions</Text>
                  </Pressable>
                  <View style={{ borderWidth: 0.5, alignSelf: "center", width: "97%", borderColor: "#707070", marginTop: this.state.width < 769 ? 8 : 14 }}></View>
                  <Pressable
                    onPress={() => this.props.navigation.navigate("Subscription")}
                    style={{ marginTop: this.state.width < 769 ? 14 : 16, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: this.state.width < 769 ? 20 : 24, color: '#3B3B3B', fontFamily: 'OpenSans-SemiBold' }}>Subscription</Text>
                    <Text style={{ fontSize: this.state.width < 769 ? 15 : 18, color: '#3B3B3B', marginTop: 12, opacity: 0.9, fontFamily: 'OpenSans-Regular', textAlign: "center" }}>We’ll offer the best solution. Connect by phone, chat, email</Text>
                  </Pressable>
                  <View style={{ borderWidth: 0.5, alignSelf: "center", width: "97%", borderColor: "#707070", marginTop: 14 }}></View>
                </View>
              </ScrollView>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modaladd}
                onRequestClose={() => {
                  this.setState({ modaladd: false });
                }}
              >
                <View style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: 'transparent',
                  paddingHorizontal: 50,

                }}>
                  <View style={{
                    borderRadius: 10,
                    backgroundColor: "white",
                    width: this.state.width < 769 ? '100%' : '50%', height: 'auto', padding: 20,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 9,
                    },
                    shadowOpacity: 0.50,
                    shadowRadius: 12.35,

                    elevation: 19,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
                      <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Please Fill Business Information First</Text>
                    </View>
                    {/* <View style={{}}>
                                <TextInput
                                    placeholder='e.g “Outdoor” or similar'
                                    placeholderTextColor={'#000000'}
                                    value={this.state.seating}
                                    selectionColor={'#067655'}
                                    onChangeText={(value) => this.setState({ seating: value })}
                                    style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: '#000000', borderRadius: 7, backgroundColor: '#EDEDF4', paddingLeft: 10 }} />
                            </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 23 }}>
                      <Pressable
                        onPress={() => this.setState({ modaladd: false })}
                      >
                        <Text style={{ fontSize: 20, color: '#000', fontFamily: 'OpenSans-Bold' }}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          this.setState({ modaladd: false })
                          this.props.navigation.navigate("Companyinfo")
                        }}
                        style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25 }}>
                        <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'Poppins-SemiBold' }}>Next</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </View> :
            <View>
              <InternetCheck />
            </View>
        }
      </View>
    )
  }
}