import { Text, View, Dimensions, Pressable, Image, TextInput, Modal, Platform, KeyboardAvoidingView, BackHandler } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToggleSwitch from 'toggle-switch-react-native'
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { basesUrl } from '../../App';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class Settings extends Component {

    NetInfoSubscribtion = null;


    constructor() {
        super();
        this.state = {
            width: 0,
            busId: 0,
            closetime: false,
            openModel: false,
            selectedRange: {},
            showCalender: false,
            toggal: true,
            toggalSwitch: false,
            confi: "",
            firstN: "",
            secondN: "",
            settingId: 0,
            modaladdcan: false,
            apisuccessstatus: false,
            apierrormessage: "",
            editTextInput: false,
            showMessage: false,
            connection_status: false,
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        let deviceWidth = Dimensions.get("screen").width;
        this.setState({ width: deviceWidth });
        let ss = await AsyncStorage.getItem("businessId");
        this.setState({ busId: ss });
        this.getnotifmessage();

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion && this.NetInfoSubscribtion();
    }

    _handleConnectivityChange = (state) => {
        this.setState({
            connection_status: state.isConnected,
        })
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    }

    getnotifmessage = async () => {
        let ss = await AsyncStorage.getItem("businessId")
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(basesUrl + "v1/Businesses/GetNotificationSettings?businessId=" + ss, "token");
        axios.get(basesUrl + "v1/Businesses/GetNotificationSettings?businessId=" + ss, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data.data, "get");
            if (re.data.data != null) {
                this.setState({
                    confi: re.data.data.confirmationQuoted,
                    settingId: re.data.data.id,
                    firstN: re.data.data.firstMsg,
                    secondN: re.data.data.secondMsg,
                    toggal: re.data.data.quotedStatus == 1 ? true : false,
                    toggalSwitch: re.data.data.deafultSettings
                })
            } else {
                console.log("ok");
            }

        })
    }

    lastSubmit = async () => {
        if (this.state.toggalSwitch == true) {
            this.reset();
        } else {
            let Data = {
                "id": this.state.settingId,
                "businessId": this.state.busId,
                "confirmationQuoted": this.state.confi,
                "quotedStatus": this.state.toggal == true ? 1 : 0,
                "confirmationETA": "string",
                "etaStatus": 0,
                "firstMsg": this.state.firstN,
                "secondMsg": this.state.secondN,
                "deafultSettings": false
            }
            console.log(Data, "Data");
            let token = await AsyncStorage.getItem("jwtoken")
            console.log(token, "token");
            axios.post(basesUrl + "v1/Businesses/ManageNotificationSettings", Data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }).then((re) => {
                console.log(re.data, "succ");
                if (re.data.succeeded == true) {
                    this.props.navigation.navigate("Subscription")
                    this.setState({ modaladdcan: false, apisuccessstatus: false, apierrormessage: "" })
                } else {
                    console.log("error");
                    this.setState({ modaladdcan: false, apisuccessstatus: true, apierrormessage: re.data.message })
                }
            })
        }
    }

    reset = async () => {
        let Data = {
            "id": this.state.settingId,
            "businessId": this.state.busId,
            "confirmationQuoted": "Your estimated wait at [Business] is [estimate] mins.",
            "quotedStatus": 1,
            "confirmationETA": "string",
            "etaStatus": 0,
            "firstMsg": "We are ready for you at [Business]! If you decided not to come, let us know",
            "secondMsg": "Its your turn! Please come by or let us know if you are not coming",
            "deafultSettings": true
        }
        console.log(Data, "Data");
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token, "token");
        axios.post(basesUrl + "v1/Businesses/ManageNotificationSettings", Data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data, "succ");
            if (re.data.succeeded == true) {
                this.props.navigation.navigate("Subscription")
                this.getnotifmessage();
                this.setState({ modaladdcan: false, apisuccessstatus: false, apierrormessage: "" })
            } else {
                console.log("error");
                this.setState({ modaladdcan: false, apisuccessstatus: true, apierrormessage: re.data.message })
            }
        })
    }

    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View style={{ height: "100%", backgroundColor: "#EDEDF4" }}>
                            {
                                this.state.apisuccessstatus == true ? (<View style={{ marginTop: Platform.OS == "ios" ? "8%" : 0, backgroundColor: "#B10808", justifyContent: 'center', alignItems: "center", }}>
                                    <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>{this.state.apierrormessage}</Text>
                                </View>) : null
                            }
                            {/* {
                    this.state.showMessage ?
                        <View>
                            {
                                this.state.toggalSwitch == false ? (
                                    <View style={{ marginTop: Platform.OS == "ios" ? "8%" : 0, backgroundColor: "#6E6E6E", justifyContent: 'center', alignItems: "center", }}>
                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>Default Settings On </Text>
                                    </View>
                                ) : (
                                    <View style={{ marginTop: Platform.OS == "ios" ? "8%" : 0, backgroundColor: "#41A800", justifyContent: 'center', alignItems: "center", }}>
                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>Default Settings Off</Text>
                                    </View>
                                )
                            }
                        </View> : null
                } */}
                            <KeyboardAvoidingView behavior='padding'>
                                <View style={{ height: "100%" }}>
                                    <View style={{ backgroundColor: "black" }}>
                                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, paddingTop: Platform.OS == "ios" ? 50 : 15, width: "63%" }}>
                                            <Pressable
                                                onPress={() => this.props.navigation.navigate("Subscription")}
                                                style={{ marginLeft: this.state.width < 769 ? "2.5%" : "3%" }}
                                            >
                                                <Image
                                                    source={require('../Assets/icon-back-01.png')}
                                                    style={{ width: this.state.width < 769 ? 24 : 40, height: this.state.width < 769 ? 12 : 20, marginTop: 0, }}
                                                />
                                            </Pressable>
                                            <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-Medium', }}>Settings</Text>
                                            {/* <Pressable
                        onPress={() => this.reset()}
                        style={{ backgroundColor: '#CC0707', paddingHorizontal: this.state.width < 769 ? 15 : 21, paddingVertical: 5, borderRadius: 127, marginRight: this.state.width < 769 ? "1.5%" : "3.5%" }}
                    >
                        <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 14 : 21, fontFamily: 'Poppins-Medium' }}>Reset</Text>
                    </Pressable> */}
                                            {/* <View style={{ marginRight: this.state.width < 769 ? "1.5%" : "3.5%" }}>
                        <ToggleSwitch
                            isOn={this.state.toggalSwitch}
                            onColor="#41A800"
                            offColor="#6E6E6E"
                            size={this.state.width < 769 ? "medium" : "large"}
                            onToggle={() =>
                                this.setState({
                                    toggalSwitch: !this.state.toggalSwitch
                                })
                            }

                        />
                    </View> */}
                                        </View>
                                    </View>
                                    <View style={{ padding: this.state.width < 769 ? 10 : 30, paddingHorizontal: this.state.width < 769 ? 20 : 40 }}>
                                        {/* <View style={{ backgroundColor: "#000", borderRadius: 10, padding: 10, }}>
                        <Text style={{ color: '#fff', fontSize: this.state.width < 769 ? 18 : 21, fontFamily: 'Poppins-Medium' }}>Customize messages</Text>
                        <Text style={{ color: '#fff', fontSize: this.state.width < 769 ? 12 : 21, fontFamily: 'Poppins-Medium', opacity: 0.7 }}>Upgrade to Premium or Pro to customize your notifications</Text>
                        <View style={{width:"100%",alignItems:'flex-end'}}>
                        <Pressable style={{ backgroundColor: "#41A800", borderRadius: 10, padding: 5, width: 100, justifyContent: "flex-end", alignItems: 'center', marginTop: 10,  }}>
                            <Text style={{ color: '#fff', fontSize: this.state.width < 769 ? 14 : 21, fontFamily: 'Poppins-Medium' }}>Upgrade!</Text>
                        </Pressable>
                        </View>
                    </View> */}
                                        <View style={{ height: "90%", paddingVertical: 3 }}>
                                            <View style={{ marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-start" }}>
                                                    <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 18 : 21, fontFamily: 'Poppins-Regular', top: 1 }}>Default Settings</Text>
                                                    <ToggleSwitch
                                                        isOn={this.state.toggalSwitch}
                                                        onColor="#41A800"
                                                        offColor="#6E6E6E"
                                                        size={this.state.width < 769 ? "medium" : "large"}
                                                        onToggle={() =>
                                                            this.setState({
                                                                toggalSwitch: !this.state.toggalSwitch
                                                            })
                                                        }

                                                    />
                                                </View>
                                            </View>
                                            <View style={{ borderWidth: 1, borderColor: '#707070', opacity: 0.2, marginTop: "5%" }}></View>
                                            <ScrollView showsVerticalScrollIndicator={false}>
                                                <View style={{ marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-start" }}>
                                                        <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 18 : 21, fontFamily: 'Poppins-SemiBold', top: 1 }}>Confirmation Text</Text>
                                                        <ToggleSwitch
                                                            isOn={this.state.toggal}
                                                            onColor="#41A800"
                                                            offColor="#6E6E6E"
                                                            size={this.state.width < 769 ? "medium" : "large"}
                                                            onToggle={isOn => this.setState({ toggal: !this.state.toggal })}
                                                        />
                                                    </View>
                                                    <View style={{ marginTop: Platform.OS == "android" ? "1%" : "2%" }}>
                                                        <TextInput
                                                            placeholder='Customize the confirmation texts and set whether they automatically are sent to each party or not'
                                                            value={this.state.confi}
                                                            onChangeText={(text) => this.setState({ confi: text }, () => console.log(this.state.confi, "ok"))}
                                                            multiline={true}
                                                            maxLength={150}
                                                            editable={this.state.toggalSwitch == true ? false : true}
                                                            style={{ backgroundColor: '#fff', borderRadius: 5, height: this.state.width < 769 ? 100 : 120, textAlignVertical: 'top', padding: 10, fontSize: this.state.width < 769 ? 13 : 18 }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 18 : 21, fontFamily: 'Poppins-SemiBold', top: 10 }}>First Notification Text</Text>
                                                    </View>
                                                    <View style={{ marginTop: 18 }}>
                                                        <TextInput
                                                            placeholder='We are ready for you at Anand Foods! If you decided not to come, let us know at'
                                                            value={this.state.firstN}
                                                            onChangeText={(text) => this.setState({ firstN: text }, () => console.log(this.state.firstN, "ok"))}
                                                            multiline={true}
                                                            maxLength={150}
                                                            editable={this.state.toggalSwitch == true ? false : true}
                                                            style={{ backgroundColor: '#fff', borderRadius: 5, height: this.state.width < 769 ? 100 : 120, textAlignVertical: 'top', padding: 10, fontSize: this.state.width < 769 ? 13 : 18 }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 18 : 21, fontFamily: 'Poppins-SemiBold', top: 10 }}>Second Notification Text</Text>

                                                    </View>
                                                    <View style={{ marginTop: 18 }}>
                                                        <TextInput
                                                            placeholder='We are ready for you at Anand Foods! If you decided not to come, let us know at'
                                                            value={this.state.secondN}
                                                            onChangeText={(text) => this.setState({ secondN: text }, () => console.log(this.state.secondN, "ok"))}
                                                            multiline={true}
                                                            maxLength={150}
                                                            editable={this.state.toggalSwitch == true ? false : true}
                                                            style={{ backgroundColor: '#fff', borderRadius: 5, height: this.state.width < 769 ? 100 : 120, textAlignVertical: 'top', padding: 10, fontSize: this.state.width < 769 ? 13 : 18 }}
                                                        />
                                                    </View>
                                                </View>
                                            </ScrollView>
                                        </View>

                                    </View>
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={this.state.modaladdcan}
                                        onRequestClose={() => {
                                            this.setState({ modaladdcan: false });
                                        }}
                                    >
                                        <View style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: this.state.width < 769 ? "flex-end" : "center",
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
                                                    <Image
                                                        source={require('../Assets/Iconawesome-check-circle.png')}
                                                        style={{ width: this.state.width < 769 ? 35 : 38, height: this.state.width < 769 ? 35 : 38, }}
                                                    />
                                                    <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Would you like to save ?</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                                    <Pressable
                                                        onPress={() => this.lastSubmit()}
                                                        style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                                        <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => this.setState({ modaladdcan: false })}
                                                        style={{ backgroundColor: 'black', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}
                                                    >
                                                        <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>No</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                    {/* <Pressable style={{ backgroundColor: "#067655", marginTop:12, padding:10,justifyContent:'center', alignItems:'center', borderRadius:0 }}>
                        <Text style={{ color: '#fff', fontSize: this.state.width < 769 ? 18 : 21, fontFamily: 'Poppins-SemiBold' }}>Submit</Text>
                    </Pressable> */}
                                </View>
                            </KeyboardAvoidingView>
                            <Pressable
                                onPress={() => this.setState({ modaladdcan: true })}
                                style={{ position: 'absolute', bottom: 0, backgroundColor: '#067655', width: '100%', paddingVertical: 15 }}>
                                <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', fontFamily: 'OpenSans-SemiBold' }}>Submit</Text>
                            </Pressable>
                        </View> :
                        <View>
                            <InternetCheck />
                        </View>
                }
            </View>
        )
    }
}