import { Text, View, Dimensions, Image, Pressable, ScrollView, Modal, TextInput, BackHandler } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateRangePicker from "rnv-date-range-picker";
import moment from "moment";
import ProgressCircle from 'react-native-progress-circle'
import { Platform } from 'react-native';
import { basesUrl } from '../../App';
import axios from 'axios';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class Subscription extends Component {

    NetInfoSubscribtion = null;

    constructor() {
        super();
        this.state = {
            width: 0,
            busId: 0,
            closetime: false,
            selectedRange: {},
            showCalender: false,
            statices: {},
            listnoti: {},
            useNotifylist: [],
            pageNo: 1,
            rechargeModal: false,
            messagePrice: 0.01,
            totalAmount: 0,
            connection_status: false,
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        let deviceWidth = Dimensions.get("screen").width
        this.setState({ width: deviceWidth })
        let ss = await AsyncStorage.getItem("businessId")
        this.setState({ busId: ss })
        this.getdata();
        this.getNotifyList();
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

    getdata = async () => {
        let ss = await AsyncStorage.getItem("businessId")
        let token = await AsyncStorage.getItem("jwtoken")
        axios.get(basesUrl + "v1/Businesses/GetMsgStatisticsByBusinessID?businessId=" + ss + "&currentDataTime=19-01-2023", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log("getnotifylistddd", re.data.data.msgSent);
            this.setState({ statices: re.data.data })
        })
    }

    getNotifyList = async () => {
        let ss = await AsyncStorage.getItem("businessId")
        let token = await AsyncStorage.getItem("jwtoken")
        axios.get(basesUrl + "v1/Businesses/GetNotificationList?bussinessID=" + ss + "&pageNo=1&pageSize=10", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data.data.notifyDetails.data, "getss");
            this.setState({ listnoti: re.data.data, useNotifylist: re.data.data.notifyDetails.data })
        })
    }

    calculateMsgPricePertext = (text) => {
        if (text.match(/^[0-9]+$/) || text.length == 0) {
            const textValue = text * this.state.messagePrice;
            this.setState({
                totalAmount: textValue,
                errorMessage: false
            })
        } else {
            this.setState({
                errorMessage: true
            })
        }
    }

    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View style={{ height: "100%", backgroundColor: "#EDEDF4" }}>
                            <View style={{ backgroundColor: '#000000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: this.state.width < 769 ? 10 : 30, paddingVertical: 15, paddingTop: Platform.OS == "ios" ? 50 : 15 }}>
                                <Pressable
                                    onPress={() => this.props.navigation.navigate("Navbar")}
                                >
                                    <Image
                                        source={require('../Assets/hamburger.png')}
                                        style={{ width: 36, height: 36 }}
                                    />
                                </Pressable>
                                <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-Medium' }}>Subscription</Text>
                                <Pressable
                                    // onPress={() => this.setState({ backgroundColorsss: true })}
                                    style={{ backgroundColor: '#067655', paddingHorizontal: this.state.width < 769 ? 15 : 21, paddingVertical: 5, borderRadius: 127 }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 14 : 21, fontFamily: 'Poppins-Medium' }}>Basic</Text>
                                    {/* <Image
                            source={require('../Assets/small-sb-logo.png')}
                            style={{ width: 50, height: 51 }}
                        /> */}
                                </Pressable>
                            </View>
                            <View style={{ padding: this.state.width < 769 ? 15 : 30 }}>
                                <View style={{
                                    justifyContent: 'space-between',
                                    borderWidth: 1, borderColor: "#fff", borderRadius: 7, backgroundColor: "#fff", padding: this.state.width < 769 ? 15 : 20, flexDirection: "row", paddingVertical: this.state.width < 769 ? 15 : 30, paddingRight: this.state.width < 769 ? 15 : 30,
                                    shadowColor: "#06765526",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },
                                    shadowOpacity: 0.58,
                                    shadowRadius: 16.00,
                                    elevation: 24,
                                }}>
                                    <View style={{
                                        marginLeft: this.state.width < 769 ? 0 : 12,
                                    }}>
                                        <ProgressCircle
                                            percent={(this.state.statices.msgSent * 100) / this.state.statices.totalSMS}
                                            radius={this.state.width < 769 ? 50 : 85}
                                            borderWidth={this.state.width < 769 ? 4 : 10}
                                            color="#067655"
                                            shadowColor="#FFB6B6"
                                            bgColor="#000"

                                        >
                                            <Text style={{ fontSize: this.state.width < 769 ? 19 : 26, color: "#fff", fontFamily: "Poppins-Medium" }}>{this.state.statices.msgSent}</Text>
                                            <Text style={{ fontSize: this.state.width < 769 ? 9 : 16, color: "#fff", fontFamily: "Poppins-Medium" }}>Messages</Text>
                                            <Text style={{ fontSize: this.state.width < 769 ? 9 : 16, color: "#fff", fontFamily: "Poppins-Medium" }}>Sent</Text>
                                        </ProgressCircle>
                                    </View>
                                    <View style={{ width: this.state.width < 769 ? "63%" : "68%", marginRight: this.state.width < 769 ? 0 : 10 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                                            <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-Medium' }}>Total Messages:</Text>
                                            <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-Medium' }}>{this.state.statices.totalSMS}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', marginTop: this.state.width < 769 ? Platform.OS == "android" ? 0 : 5 : Platform.OS == "android" ? 0 : 15 }}>
                                            <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-Medium' }}>Due Date:</Text>
                                            <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-Medium' }}>30/01/2023</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Pressable onPress={() => this.setState({ rechargeModal: true })}
                                                style={{ backgroundColor: "#067655", borderRadius: 127, paddingVertical: 5, justifyContent: 'center', alignItems: 'center', marginTop: this.state.width < 769 ? Platform.OS == "android" ? 8 : 15 : Platform.OS == "android" ? 20 : 40, width: this.state.width < 769 ? "100%" : "48%" }}>
                                                <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 13 : 21, fontFamily: 'Poppins-Medium' }}>Recharge</Text>
                                            </Pressable>
                                            {
                                                this.state.width < 769 ? null : (<Pressable
                                                    onPress={() => this.props.navigation.navigate("Settings")}
                                                    style={{ backgroundColor: "#000", borderRadius: 127, paddingVertical: 5, justifyContent: 'center', alignItems: 'center', marginTop: this.state.width < 769 ? Platform.OS == "android" ? 8 : 15 : Platform.OS == "android" ? 20 : 40, width: "48%" }}>
                                                    <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 13 : 21, fontFamily: 'Poppins-Medium' }}>Settings</Text>
                                                </Pressable>)
                                            }

                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ marginTop: "3%", flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-SemiBold' }}>{this.state.listnoti.startDate} - {this.state.listnoti.endDate} ({this.state.listnoti.cnt < 10 ? "0" + this.state.listnoti.cnt : this.state.listnoti.cnt} Messages)</Text>
                                        <Pressable
                                            onPress={() => this.setState({ showCalender: !this.state.showCalender })}
                                            style={{ backgroundColor: '#067655', borderRadius: this.state.width < 769 ? 20 : 25, height: this.state.width < 769 ? 30 : 50, width: this.state.width < 769 ? 30 : 50, marginRight: 0, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <Image
                                                source={require('../Assets/Iconawesome-calendar-alt.png')}
                                                style={{ width: this.state.width < 769 ? 12 : 24, height: this.state.width < 769 ? 13 : 28 }}
                                            />
                                        </Pressable>
                                    </View>
                                    <View style={{ height: this.state.width < 769 ? Platform.OS == "android" ? 430 : 490 : Platform.OS == "android" ? 740 : 690 }}>
                                        {
                                            this.state.useNotifylist.length != 0 ? (<ScrollView
                                                onScrollEndDrag={async () => {
                                                    let ss = await AsyncStorage.getItem("businessId")
                                                    let token = await AsyncStorage.getItem("jwtoken")
                                                    this.setState({ pageNo: this.state.pageNo + 1 })
                                                    console.log(this.state.pageNo, "count");
                                                    console.log(basesUrl + "v1/Businesses/GetNotificationList?bussinessID=" + ss + "&pageNo=1&pageSize=10");
                                                    axios.get(basesUrl + "v1/Businesses/GetNotificationList?bussinessID=" + ss + "&pageNo=" + this.state.pageNo + "&pageSize=3", {
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                            'Content-Type': 'application/json-patch+json'
                                                        }
                                                    }).then((re) => {
                                                        console.log(re.data.data.notifyDetails.data, "getss");
                                                        if (re.data.data.notifyDetails.data.length != 0) {
                                                            let datss = this.state.useNotifylist
                                                            console.log(datss, "before");
                                                            re.data.data.notifyDetails.data.map((ite) => {
                                                                datss.push(ite)
                                                            })
                                                            console.log(datss, "after");


                                                            // this.state.useNotifylist.concat(re.data.data.notifyDetails.data)
                                                            // console.log(this.state.useNotifylist,"ok",this.state.useNotifylist.concat(re.data.data.notifyDetails.data));
                                                            this.setState({ useNotifylist: datss })
                                                        } else {
                                                            console.log("no data found")
                                                        }
                                                    })
                                                }}
                                            >
                                                {
                                                    this.state.useNotifylist.map((item) =>
                                                        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 5, paddingLeft: 7, borderRadius: this.state.width < 769 ? 20 : 30, paddingVertical: 5, marginTop: this.state.width < 769 ? 10 : 20, }}>
                                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                <View style={{ backgroundColor: "#067655", width: this.state.width < 769 ? 29 : 49, height: this.state.width < 769 ? 29 : 49, borderRadius: this.state.width < 769 ? 14 : 24, justifyContent: "center", alignItems: 'center' }}>
                                                                    <Text style={{ color: '#FFFFFF', fontSize: this.state.width < 769 ? 14 : 21, fontFamily: 'Poppins-Medium', marginTop: this.state.width < 769 ? 3 : 3 }}>{item.msgCnt}</Text>
                                                                </View>
                                                                <Text style={{ color: '#000', fontSize: this.state.width < 769 ? 16 : 21, fontFamily: 'Poppins-Medium', marginTop: this.state.width < 769 ? 3 : 3, marginLeft: this.state.width < 769 ? 10 : 15, opacity: 0.7 }}>{item.name}</Text>
                                                            </View>
                                                            <Text style={{ color: '#000000', fontSize: this.state.width < 769 ? 16 : 21, fontFamily: 'OpenSans-SemiBold', marginRight: this.state.width < 769 ? 5 : 15, marginTop: Platform.OS == "android" ? this.state.width < 769 ? 0 : 5 : 3 }}>{item.notifyDate}</Text>
                                                        </View>)
                                                }
                                            </ScrollView>) : (
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    < Image
                                                        source={require('../Assets/no-data-found.png')}
                                                        style={{ height: 200, width: 200, marginTop: "30%" }}
                                                        resizeMode="contain"
                                                    />
                                                </View>)
                                        }
                                    </View>
                                </View>
                            </View>
                            <Modal
                                animationType="slide"
                                transparent
                                visible={this.state.showCalender}
                                onRequestClose={() => {
                                    this.setState({ showCalender: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    marginBottom: Platform.OS == "ios" ? 20 : 0,

                                }}>
                                    <Pressable
                                        onPress={() => this.setState({ showCalender: false })}
                                        style={{
                                            marginBottom: 10, backgroundColor: "#ffff", borderRadius: 127, borderWidth: 1, borderColor: "#a3a3a3"
                                            , width: 40, height: 40, justifyContent: 'center', alignItems: 'center'
                                        }}>
                                        <Image
                                            source={require('../Assets/ico-close.png')}
                                            style={{ width: this.state.width < 769 ? 22 : 26, height: this.state.width < 769 ? 18 : 23, }}
                                        />
                                    </Pressable>

                                    <View style={{
                                        borderTopLeftRadius: 15, borderTopRightRadius: 15,
                                        backgroundColor: "white",
                                        width: this.state.width < 769 ? '100%' : '100%', height: 350,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 9,
                                        },
                                        shadowOpacity: 0.50,
                                        shadowRadius: 12.35,

                                        elevation: 19,
                                    }}>
                                        <View>
                                            <DateRangePicker
                                                onSelectDateRange={async (range) => {
                                                    this.setState({ selectedRange: range }, () => console.log(this.state.selectedRange))
                                                    let ss = await AsyncStorage.getItem("businessId")
                                                    let token = await AsyncStorage.getItem("jwtoken")
                                                    this.setState({ pageNo: this.state.pageNo + 1 })
                                                    console.log(this.state.pageNo, "count");
                                                    console.log(basesUrl + "v1/Businesses/GetNotificationList?bussinessID=" + ss + "&pageNo=1&pageSize=10");
                                                    axios.get(basesUrl + "v1/Businesses/GetNotificationList?bussinessID=" + ss + "&startDate=" + this.state.selectedRange.firstDate + "&endDate=" + this.state.selectedRange.secondDate + "&pageNo=1&pageSize=10", {
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                            'Content-Type': 'application/json-patch+json'
                                                        }
                                                    }).then((re) => {
                                                        console.log(re.data.data.notifyDetails.data, "filterdata");
                                                        this.setState({ listnoti: re.data.data, useNotifylist: re.data.data.notifyDetails.data, showCalender: false })
                                                    })

                                                }}
                                                responseFormat="YYYY-MM-DD"
                                                maxDate={moment()}
                                                minDate={moment().subtract(100, "days")}
                                                selectedDateContainerStyle={{
                                                    height: 35,
                                                    width: "100%",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "blue",
                                                }}
                                                selectedDateStyle={{
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            {
                                this.state.width < 769 ? (<Pressable
                                    onPress={() => this.props.navigation.navigate("Settings")}
                                    style={{
                                        marginTop: 15, position: 'absolute', bottom:
                                            Platform.OS == "ios" ? 100 : 30, right: 30,
                                    }}
                                >
                                    <Image
                                        source={require('../Assets/Group-109.png')}
                                        style={{ width: 46, height: 46 }}
                                    />
                                </Pressable>) : null
                            }
                            <Modal
                                animationType="fade"
                                transparent
                                visible={this.state.rechargeModal}
                                onRequestClose={() => {
                                    this.setState({ rechargeModal: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    marginBottom: Platform.OS == "ios" ? 20 : 0

                                }}>

                                    <View style={{
                                        borderRadius: 15,
                                        backgroundColor: "white",
                                        width: this.state.width < 769 ? '90%' : '50%',
                                        height: this.state.width < 769 ? 280 : 340,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 9,
                                        },
                                        shadowOpacity: 0.50,
                                        shadowRadius: 12.35,

                                        elevation: 19,
                                    }}>
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={{ color: '#067655', fontSize: 18, fontFamily: 'Poppins-SemiBold', marginTop: "3%", marginLeft: this.state.width < 769 ? "5%" : "4%" }}>Add Messages</Text>
                                            <Pressable
                                                onPress={() => this.setState({ rechargeModal: false })}
                                                style={{ marginTop: "3%", marginRight: "3%" }}
                                            >
                                                <Image
                                                    source={require('../Assets/ico-close.png')}
                                                    style={{ width: this.state.width < 769 ? 22 : 26, height: this.state.width < 769 ? 18 : 23 }}
                                                />
                                            </Pressable>
                                        </View>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View style={{ paddingBottom: 20, padding: 10, }}>
                                                <View>
                                                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <View>
                                                <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold' }}>Text User </Text>
                                                <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>9999999</Text>
                                            </View>
                                            <View >
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlign: "right" }}>12-12-2023</Text>
                                                    <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlign: "right" }}></Text>
                                                </View>
                                                <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: "right" }}> Notify Timing: 12:30pm</Text>
                                            </View>
                                        </View> */}
                                                    <View style={{ padding: "3%" }}>
                                                        <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Price/Message      :</Text>
                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Rs. {this.state.messagePrice}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>No.of messages    :</Text>
                                                            <View>
                                                                <TextInput
                                                                    placeholder=''
                                                                    placeholderTextColor={'#000000'}
                                                                    value={this.state.Notes}
                                                                    onChangeText={(text) => this.calculateMsgPricePertext(text)}
                                                                    selectionColor={'#067655'}
                                                                    maxLength={4}
                                                                    keyboardType={"numeric"}
                                                                    caretHidden={false}
                                                                    style={{ marginTop: "2%", color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, minWidth: 80, height: 40, textAlignVertical: "center", paddingLeft: "3%", fontSize: 16, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 0 : 0, textAlign: "right" }}
                                                                />
                                                                {
                                                                    this.state.errorMessage == true ?
                                                                        <Text style={{ color: "red" }}>Enter valid no.</Text> : null
                                                                }
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 1, borderWidth: 0.5, borderColor: '#707070', marginTop: "5%" }}></View>
                                                        <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", marginTop: "2%" }}>
                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Total Amount         :</Text>
                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold' }}>Rs. {this.state.totalAmount == 0 ? 0 : this.state.totalAmount.toString().slice(0, 5)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "80%", alignSelf: "center", marginTop: "2%" }}>
                                                        <Pressable onPress={() => this.setState({ rechargeModal: false })}
                                                            style={{ padding: "3%", backgroundColor: "#067655", borderRadius: 127, justifyContent: 'center', alignItems: 'center', marginTop: this.state.width < 769 ? Platform.OS == "android" ? 8 : 15 : Platform.OS == "android" ? 20 : 40, width: this.state.width < 769 ? "33%" : "48%" }}>
                                                            <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 14 : 18, fontFamily: 'Poppins-Medium' }}>Cancel</Text>
                                                        </Pressable>
                                                        <Pressable onPress={() => this.setState({ rechargeModal: false })}
                                                            style={{ padding: "3%", backgroundColor: "#067655", borderRadius: 127, justifyContent: 'center', alignItems: 'center', marginTop: this.state.width < 769 ? Platform.OS == "android" ? 8 : 15 : Platform.OS == "android" ? 20 : 40, width: this.state.width < 769 ? "33%" : "48%" }}>
                                                            <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 14 : 18, fontFamily: 'Poppins-Medium' }}>Recharge</Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                            </View>
                                        </ScrollView>
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