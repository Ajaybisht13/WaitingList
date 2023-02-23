import { Text, View, Pressable, Image, Dimensions, ScrollView, Modal, Platform, TextInput, BackHandler } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { basesUrl } from '../../App';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class History extends Component {

    NetInfoSubscribtion = null;

    constructor() {
        super();
        this.state = {
            width: 0,
            busId: 0,
            cureTime: new Date(),
            topScroll: [],
            waitList: [],
            getfilterValue: [],
            openModel: false,
            swipeId: 0,
            closetime: false,
            endTime: new Date(),
            statuS: 0,
            modaladdcan: false,
            customValueShow: false,
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
        this.getListss()
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

    getListss = async () => {
        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time).toJSON()
        this.setState({ cureTime: time })
        let ss = await AsyncStorage.getItem("businessId")
        let token = await AsyncStorage.getItem("jwtoken")
        let buseinssId = ss
        let dateforApi = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
        await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlistHistory?businessId=" + buseinssId + "&waitListDate=" + dateforApi, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            this.setState({ topScroll: re.data.data.waitListSliders })
            const newArray = re.data.data.businessWaitlistResponses.map(e => {
                return {
                    ...e,
                    selected: false
                }
            })
            this.setState({
                waitList: newArray
            }, () => {
                console.log("History array", JSON.stringify(this.state.waitList));
            })
            this.setState({ getfilterValue: newArray })
        })
    }

    seatingarea = (item) => {
        let seatingle = item.businessWaitlistSeatings
        if (seatingle.length != 0) {
            if (item.businessWaitlistSeatings[0].seatingArea.length < 4) {
                return item.businessWaitlistSeatings[0].seatingArea
            } else {
                return item.businessWaitlistSeatings[0].seatingArea.slice(0, 5) + ".."
            }
        } else {
            return null
        }
        //     return data.item.businessWaitlistSeatings[0].seatingArea + ".."
    }


    counterTime = (item) => {
        if (item.isReservation != true) {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)

            var diff = (new Date(item.reservation).getTime() - new Date().getTime()) / 1000;
            diff /= 60;

            return Math.abs(Math.round(diff));
        } else {

            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)

            var diff = (new Date(item.reservation).getTime() - new Date(time).getTime()) / 1000;
            diff /= 60;

            return Math.abs(Math.round(diff));
        }
    }

    ArriveTime = (item) => {
        let fullTime = new Date(item.reservation)
        fullTime = fullTime.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })
        return fullTime
    }


    setMo = (item) => {
        this.setState({ openModel: true, swipeId: item.id, statuS: item.status })
    }

    cancelsssModal = async () => {
        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time)

        let token = await AsyncStorage.getItem("jwtoken")
        let datas = {
            "id": this.state.swipeId,
            "status": 5,
            "currentDataTime": time
        }
        let selectUnselectitem = this.state.waitList.map((item, index) => {
            if (this.state.swipeId == index.id) {
                item.selected = false;
            }
            return { ...item }
        })
        this.setState({ waitList: selectUnselectitem })
        await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateWaitlistStatus", datas, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {

            this.setState({ openModel: false, modaladdcan: false })
            this.getListss()
        })
    }
    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View>
                            <View style={{ backgroundColor: '#000000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, paddingTop: Platform.OS == "ios" ? 50 : 15 }}>
                                <Pressable
                                    onPress={() => this.props.navigation.navigate("Navbar")}
                                >
                                    <Image
                                        source={require('../Assets/hamburger.png')}
                                        style={{ width: 36, height: 36 }}
                                    />
                                </Pressable>
                                <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-Medium' }}>Waiting List History</Text>
                                <Pressable
                                    onPress={() => this.setState({ closetime: true })}
                                    style={{ backgroundColor: '#067655', paddingHorizontal: this.state.width < 769 ? 10 : 14, paddingVertical: this.state.width < 769 ? 10 : 14, borderRadius: 127 }}
                                >
                                    <Image
                                        source={require('../Assets/Iconawesome-calendar-alt.png')}
                                        style={{ width: this.state.width < 769 ? 20 : 25, height: this.state.width < 769 ? 20 : 25 }}
                                    />
                                </Pressable>
                            </View>
                            <View style={{ paddingHorizontal: 10, justifyContent: "center", paddingLeft: 18, height: "90%" }}>
                                {
                                    this.state.waitList.length == 0 ?
                                        (
                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                {/* <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlignVertical: 'center' }}>{this.state.nodataa}</Text> */}
                                                <Image
                                                    source={require('../Assets/no-data-found.png')}
                                                    style={{ height: 200, width: 200 }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        ) :
                                        (
                                            <ScrollView contentContainerStyle={{ paddingBottom: Platform.OS == "android" ? 0 : "18%" }}>
                                                {
                                                    this.state.waitList.map((item) =>
                                                        <Pressable
                                                            onPress={() => this.setMo(item)}
                                                            style={{ flexDirection: 'row', marginTop: 20, borderRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, width: this.state.width < 769 ? "97%" : "97%" }}>
                                                            <Pressable
                                                                onPress={() => this.setMo(item)}
                                                                style={{ backgroundColor: 'white', paddingHorizontal: this.state.width < 769 ? 10 : 24, paddingVertical: 15, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, width: this.state.width < 769 ? "96%" : "96%" }}>
                                                                <Pressable
                                                                    onPress={() => this.setMo(item)}
                                                                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    <Pressable
                                                                        onPress={() => this.setMo(item)}
                                                                        style={{ flexDirection: 'row', justifyContent: 'space-between', width: "60%" }}>
                                                                        <View>
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold' }}>{item.customerPhone} {item.isReservation == true ? (<Image
                                                                                source={require('../Assets/noun-reservation-2408719-01.png')}
                                                                                style={{ width: 20, height: 20, }}
                                                                            />) : null}</Text>
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{item.customerName.slice(0, 12) + (item.customerName.length > 12 ? ".." : "")}</Text>
                                                                        </View>
                                                                        <Pressable >
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'center', fontFamily: 'OpenSans-Bold' }}>#{item.tableNoValue}</Text>
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{this.seatingarea(item)}</Text>
                                                                        </Pressable>
                                                                    </Pressable>
                                                                    <View style={{ width: "40%" }}>
                                                                        {
                                                                            item.isReservation != true ? (<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                                <Text style={{ color: item.timeExceed == true ? "#B10808" : "#000000", fontSize: this.state.width < 769 ? 13 : 18, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{item.status == 3 ? new Date(item.checkIn).toLocaleDateString('en-GB') : item.status == 5 ? "Check Off : --" : "Check Off : --"}</Text>
                                                                                <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{item.status == 3 ? null : null} <Text style={{ color: "#000000", fontSize: 18, textAlign: 'right', fontFamily: 'OpenSans-Regular' }}>{item.status == 3 ? null : null}</Text></Text>
                                                                            </View>) : (<Text style={{ color: "black", fontSize: this.state.width < 769 ? 12 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{new Date(item.reservation).toLocaleDateString('en-GB')}</Text>)
                                                                        }
                                                                        <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: 'right' }}>{item.status == 3 ? "Check off" : "Arrived at"}  {item.status == 3 ? new Date(item.checkIn).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) : new Date(item.reservation).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })}</Text>
                                                                    </View>
                                                                </Pressable>
                                                                {/* <View style={{flexDirection:"row"  }}>
                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', opacity: 0.7, fontFamily: 'OpenSans-Regular', }}>Preferred Area: </Text>
                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold',  }}></Text>
                                    </View> */}
                                                                <Pressable
                                                                    onPress={() => this.setMo(item)}
                                                                    style={{ borderWidth: 0.5, alignSelf: "center", width: "100%", borderColor: "#707070", marginTop: 10, opacity: 0.2 }}></Pressable>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 }}>
                                                                    <Pressable
                                                                        onPress={() => this.setMo(item)}
                                                                        style={{ flexDirection: this.state.width < 769 ? 'column' : 'row', width: "30%" }}>
                                                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{item.notes != "" ? "Notes:" : null}</Text>
                                                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold' }}>{item.notes != "" ? item.notes.slice(0, 13) + (item.notes.length > 13 ? ".." : "") : null}</Text>
                                                                    </Pressable>
                                                                    <View style={{ flexDirection: this.state.width < 769 ? 'column' : 'row' }}>
                                                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: 'right' }}>Total Members: </Text>
                                                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold', textAlign: 'right' }}>{item.groupSize} (<Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold', textAlign: 'right' }}>{item.adults != 0 ? item.adults + " Adults" : null}{item.children != 0 ? (item.adults != 0 ? "," : "") + item.children + " Kids" : null}{item.divyang != 0 ? ((item.adults != 0 || item.children != 0) ? "," : "") + item.divyang + " Disable" : null}</Text>)</Text>
                                                                    </View>
                                                                </View>
                                                            </Pressable>
                                                            <Pressable
                                                                // onPress={(data) => this.clickOpen(data)}
                                                                style={{ backgroundColor: item.status == 3 ? "#067655" : item.status == 5 ? "grey" : "#B10808", borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', borderTopRightRadius: 10, borderBottomRightRadius: 10, width: '5.5%', paddingLeft: this.state.width < 769 ? 2 : 5 }}>
                                                                <Image
                                                                    source={require('../Assets/Pathhomearrow.png')}
                                                                    style={{ transform: [{ rotate: item.selected ? "0deg" : '180deg' }], width: 9, height: 16, marginLeft: this.state.width < 769 ? 3 : 8 }}
                                                                />
                                                            </Pressable>
                                                        </Pressable>
                                                    )
                                                }
                                            </ScrollView>
                                        )
                                }
                            </View>
                            <Modal
                                animationType="slide"
                                transparent
                                visible={this.state.openModel}
                                onRequestClose={() => {
                                    this.setState({ openModel: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',


                                }}>
                                    <Pressable
                                        onPress={() => this.setState({ openModel: false })}
                                        style={{
                                            marginBottom: 10, backgroundColor: "#ffff", borderRadius: 127, borderWidth: 1, borderColor: "#a3a3a3"
                                            , width: 40, height: 40, justifyContent: 'center', alignItems: 'center'
                                        }}>
                                        <Image
                                            source={require('../Assets/ico-close.png')}
                                            style={{ width: this.state.width < 769 ? 22 : 22, height: this.state.width < 769 ? 18 : 18, }}
                                        />
                                    </Pressable>
                                    <View style={{
                                        borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                        backgroundColor: "white",
                                        width: this.state.width < 769 ? '100%' : '100%', height: 'auto',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 9,
                                        },
                                        shadowOpacity: 0.50,
                                        shadowRadius: 12.35,

                                        elevation: 19,
                                    }}>
                                        <ScrollView style={{ height: 500 }}>
                                            <View style={{ paddingBottom: 20, padding: 20, }}>
                                                {
                                                    this.state.waitList.map((item) => {

                                                        if (item.id == this.state.swipeId) {
                                                            return (
                                                                <View>
                                                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                        <View>
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold' }}>{item.customerPhone} {item.isReservation == true ? (<Image
                                                                                source={require('../Assets/noun-reservation-2408719-01.png')}
                                                                                style={{ width: 20, height: 20, }}
                                                                            />) : null}</Text>
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{item.customerName}</Text>
                                                                        </View>
                                                                        {
                                                                            item.status != 3 ? null : (<View style={{ width: "40%" }}>
                                                                                {
                                                                                    item.isReservation != true ? (<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                                        <Text style={{ color: item.timeExceed == true ? "#B10808" : "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{item.status == 3 ? new Date(item.checkIn).toLocaleDateString('en-GB') : this.counterTime(item)}</Text>
                                                                                        <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{item.status == 3 ? null : "/" + item.waitTime} <Text style={{ color: "#000000", fontSize: 18, textAlign: 'right', fontFamily: 'OpenSans-Regular' }}>{item.status == 3 ? null : "mins"}</Text></Text>
                                                                                    </View>) : (<Text style={{ color: "black", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{new Date(item.reservation).toLocaleDateString('en-GB')}</Text>)
                                                                                }
                                                                                <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: 'right' }}>{item.status == 3 ? "Check off" : ""}  {item.status == 3 ? new Date(item.checkIn).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) : ""}</Text>
                                                                            </View>)
                                                                        }
                                                                    </View>
                                                                    <View style={{ marginTop: 10 }}>
                                                                        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Total Guest:- {item.groupSize}</Text>
                                                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', marginTop: 13, }}>
                                                                            <View>
                                                                                {
                                                                                    item.adults != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 24, borderRadius: 15, }}>
                                                                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{item.adults}</Text>
                                                                                    </View>) : null
                                                                                }
                                                                                <Pressable
                                                                                // onPress={() => this.adultguest()}
                                                                                >
                                                                                    {
                                                                                        item.adults != 0 ? (<Image
                                                                                            source={require('../Assets/icon-adults-active.png')}
                                                                                            style={{ width: this.state.width < 769 ? 88 : 107, height: this.state.width < 769 ? 95 : 120 }}
                                                                                        />) : (<Image
                                                                                            source={require('../Assets/icon-adults.png')}
                                                                                            style={{ width: this.state.width < 769 ? 84 : 107, height: this.state.width < 769 ? 95 : 120, }}
                                                                                        />)
                                                                                    }

                                                                                </Pressable>
                                                                            </View>
                                                                            <View>
                                                                                {
                                                                                    item.children != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 24, borderRadius: 15, }}>
                                                                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{item.children}</Text>
                                                                                    </View>) : null
                                                                                }
                                                                                <Pressable
                                                                                // onPress={() => this.kidsguest()}
                                                                                >

                                                                                    {
                                                                                        item.children != 0 ? (<Image
                                                                                            source={require('../Assets/ico-kids-active.png')}
                                                                                            style={{ width: this.state.width < 769 ? 88 : 107, height: this.state.width < 769 ? 95 : 120, marginLeft: 10 }}
                                                                                        />) : (<Image
                                                                                            source={require('../Assets/ico-Kids.png')}
                                                                                            style={{ width: this.state.width < 769 ? 84 : 107, height: this.state.width < 769 ? 95 : 120, marginLeft: 10, }}
                                                                                        />)
                                                                                    }

                                                                                </Pressable>
                                                                            </View>
                                                                            <View>
                                                                                {
                                                                                    item.divyang != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 24, borderRadius: 15, }}>
                                                                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{item.divyang}</Text>
                                                                                    </View>) : null
                                                                                }

                                                                                <Pressable
                                                                                // onPress={() => this.disableguest()}
                                                                                >
                                                                                    {
                                                                                        item.divyang != 0 ? (<Image
                                                                                            source={require('../Assets/ico-disabled-active.png')}
                                                                                            style={{ width: this.state.width < 769 ? 88 : 107, height: this.state.width < 769 ? 95 : 120, marginLeft: 10, }}
                                                                                        />) : (<Image
                                                                                            source={require('../Assets/ico-disabled.png')}
                                                                                            style={{ width: this.state.width < 769 ? 84 : 107, height: this.state.width < 769 ? 95 : 120, marginLeft: 10, }}
                                                                                        />)
                                                                                    }

                                                                                </Pressable>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    {
                                                                        item.businessWaitlistSeatings.length == 0 ?
                                                                            null :
                                                                            <View style={{ marginTop: 10 }}>
                                                                                <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                    <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Preferred Area</Text>
                                                                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                                </View>
                                                                                {/* <ScrollView style={{ height: 120 }}> */}
                                                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                                                    {
                                                                                        item.businessWaitlistSeatings.map((item, i) =>
                                                                                            <Pressable
                                                                                                // onPress={() => this.prefArea(i, item)}
                                                                                                style={{ backgroundColor: "#067655", borderWidth: 2, borderColor: "#067655", borderRadius: 66, height: 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10, paddingVertical: 0, paddingVertical: 0, paddingHorizontal: this.state.width < 769 ? 12 : 15, paddingBottom: 4 }}>
                                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, fontFamily: 'OpenSans-Regular', color: "#FFFFFF" }}>{item.seatingArea}</Text>
                                                                                            </Pressable>
                                                                                        )
                                                                                    }
                                                                                </View>
                                                                                {/* </ScrollView> */}
                                                                            </View>
                                                                    }
                                                                    {
                                                                        item.notes != "" ? (<View style={{ marginTop: 10 }}>
                                                                            <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Notes</Text>
                                                                                <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                            </View>
                                                                            {/* <ScrollView style={{ maxHeight: 40, marginTop: "2%" }}> */}
                                                                            <TextInput
                                                                                placeholder='Notes'
                                                                                placeholderTextColor={'#000000'}
                                                                                value={item.notes}
                                                                                editable={false}
                                                                                multiline={true}
                                                                                selectionColor={'#067655'}
                                                                                style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 0 : 0, height: 40 }}
                                                                            />
                                                                            {/* </ScrollView> */}
                                                                        </View>) : null
                                                                    }
                                                                    {
                                                                        item.businessWaitlistOthers.length == 0 ?
                                                                            null :
                                                                            (
                                                                                <View style={{ marginTop: 10 }}>
                                                                                    <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                        <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Custom Fields</Text>
                                                                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                                    </View>
                                                                                    {
                                                                                        item.businessWaitlistOthers.map((li) => {

                                                                                            return (
                                                                                                <View>
                                                                                                    {
                                                                                                        li.formValue == "" ? null :
                                                                                                            <View>
                                                                                                                <TextInput
                                                                                                                    placeholder={li.formValue == "" ? 'Notes' : li.formValue}
                                                                                                                    placeholderTextColor={'#000000'}
                                                                                                                    value={li.formValue}
                                                                                                                    editable={false}
                                                                                                                    selectionColor={'#067655'}
                                                                                                                    multiline={true}
                                                                                                                    style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 0 : 0, height: 40 }}
                                                                                                                />
                                                                                                            </View>
                                                                                                    }

                                                                                                </View>
                                                                                            )
                                                                                        }
                                                                                        )
                                                                                    }
                                                                                    {/* </ScrollView> */}

                                                                                </View>)
                                                                    }
                                                                </View>
                                                            )
                                                        }
                                                    })
                                                }

                                            </View>
                                        </ScrollView>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 23 }}>
                                            {
                                                this.state.statuS == 5 || this.state.statuS == 3 ? null : (
                                                    <Pressable
                                                        onPress={() => this.setState({ modaladdcan: true, openModel: false })}
                                                        style={{ backgroundColor: '#B10808', paddingVertical: 16, paddingHorizontal: 10, width: "100%", alignItems: "center" }}>
                                                        <Text style={{ fontSize: 15, color: '#ffff', fontFamily: 'Poppins-SemiBold' }}><Image
                                                            source={require('../Assets/ico-cancel.png')}
                                                            style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                        /> Cancel</Text>
                                                    </Pressable>)
                                            }

                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <DateTimePickerModal
                                testID="dateTimePicker"
                                value={this.state.endTime}
                                isVisible={this.state.closetime}
                                mode="date"
                                is24Hour={true}
                                display="spinner"
                                maximumDate={new Date()}
                                onConfirm={async (date) => {

                                    let dateforApi = new Date(date).getFullYear() + "-" + (new Date(date).getMonth() + 1) + "-" + new Date(date).getDate()
                                    this.setState({ endTime: new Date(date), closetime: false })
                                    let ss = await AsyncStorage.getItem("businessId")
                                    let token = await AsyncStorage.getItem("jwtoken")
                                    let buseinssId = ss

                                    await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlistHistory?businessId=" + buseinssId + "&waitListDate=" + dateforApi, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            // 'Content-Type': 'application/json-patch+json'
                                        }
                                    }).then((re) => {
                                        this.setState({ topScroll: re.data.data.waitListSliders })
                                        const newArray = re.data.data.businessWaitlistResponses.map(e => {
                                            return {
                                                ...e,
                                                selected: false
                                            }
                                        })
                                        this.setState({
                                            waitList: newArray
                                        })
                                        this.setState({ getfilterValue: newArray })
                                    })

                                }}
                                onCancel={() => this.setState({ closetime: false })}
                            />
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
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Would you like to cancel ?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                onPress={() => this.cancelsssModal()}
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
                        </View > :
                        <View>
                            <InternetCheck />
                        </View>
                }
            </View>
        )
    }
}