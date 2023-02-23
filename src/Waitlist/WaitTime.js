import { Dimensions, Pressable, Text, View, Image, ScrollView, TouchableOpacity, BackHandler, KeyboardAvoidingView, Modal, Platform } from 'react-native'
import React, { Component } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { basesUrl } from '../../App';
import { checkPhone, normalAZtext } from '../Validation';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class WaitTime extends Component {

    NetInfoSubscribtion = null;

    constructor() {
        super();
        this.state = {
            areaList: [
                {
                    "id": 1,
                    "location": 'Indoor',
                    "selected": false
                },
                {
                    "id": 2,
                    "location": 'Outdoor',
                    "selected": false
                },
                {
                    "id": 3,
                    "location": 'High Chairs',
                    "selected": false
                },
                {
                    "id": 4,
                    "location": 'Bar Seating',
                    "selected": false
                },
                {
                    "id": 5,
                    "location": 'Smoking',
                    "selected": false
                },
                {
                    "id": 6,
                    "location": 'Non-Smoking',
                    "selected": false
                },
                {
                    "id": 7,
                    "location": 'Any',
                    "selected": false
                }
            ],
            exptime: [
                {
                    "id": 1,
                    "exptime": '10',
                    "selected": false
                },
                {
                    "id": 2,
                    "exptime": '15',
                    "selected": false
                },
                {
                    "id": 3,
                    "exptime": '20',
                    "selected": false
                },
                {
                    "id": 4,
                    "exptime": '25',
                    "selected": false
                },
                {
                    "id": 5,
                    "exptime": '30',
                    "selected": false
                },
                {
                    "id": 6,
                    "exptime": '35',
                    "selected": false
                },
                {
                    "id": 7,
                    "exptime": '40',
                    "selected": false
                },
                {
                    "id": 8,
                    "exptime": '45',
                    "selected": false
                },
            ],
            guest: [
                {
                    "id": 1,
                    "exptime": '2',
                    "selected": false
                },
                {
                    "id": 2,
                    "exptime": '3',
                    "selected": false
                },
                {
                    "id": 3,
                    "exptime": '4',
                    "selected": false
                },
                {
                    "id": 4,
                    "exptime": '5',
                    "selected": false
                },
                {
                    "id": 5,
                    "exptime": '6',
                    "selected": false
                },
                {
                    "id": 6,
                    "exptime": '7',
                    "selected": false
                },
                {
                    "id": 7,
                    "exptime": '8',
                    "selected": false
                },
                {
                    "id": 8,
                    "exptime": '9',
                    "selected": false
                },
            ],
            selectedIndex: 0,
            guestNo: 0,
            exptimes: 0,
            adult: 0,
            kids: 0,
            disable: 0,
            phone: '',
            customerName: "",
            width: "",
            walkIn: true,
            reservation: false,
            date: new Date(),
            closeDate: false,
            time: new Date(),
            closetime: false,
            busId: 0,
            vistlist: null,
            prefArray: [],
            customerId: 0,
            guestCheck: 0,
            expadd: 0,
            custome: [],
            lastCustome: [],
            cusValue: "",
            guestDone: null,
            waittimeselect: null,
            customephoneerror: false,
            customnameerror: false,
            Notes: "",
            modaladd: false,
            noteShow: false,
            table: "",
            tableShow: false,
            datess: new Date(),
            showDate: "",
            closetime: false,
            gettime: new Date(),
            lastDatepost: new Date(),
            selectTime: false,
            modaladds: false,
            phonempty: false,
            apisuccessstatus: false,
            registerSuccess: false,
            apierrormessage: "",
            loc: false,
            shotim: false,
            showTime: false,
            waitListDetails: {},
            businessWaitlistSeatings: [],
            updateModal: false,
            guestDoness: true,
            customeTextInput: [],
            connection_status: false,
        }
        this.updateIndex = this.updateIndex.bind(this)
    }
    componentDidMount = async () => {
        this.props.navigation.addListener('focus', async () => {
            let ss = await AsyncStorage.getItem("businessId")
            this.setState({ businessId: ss })
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        let deviceWidth = Dimensions.get("screen").width
        this.setState({ width: deviceWidth })
        let ss = await AsyncStorage.getItem("businessId")
        this.setState({ busId: ss })
        this.getseatingactivelist();
        this.getAddi();
        this.getWaitListDetails()
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


    getWaitListDetails = async () => {
        let token = await AsyncStorage.getItem("jwtoken");
        let businessWaitlistId = await AsyncStorage.getItem("businessWaitlistId");
        await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlistById?id=" + businessWaitlistId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((response) => {
            console.log("wait list response", JSON.stringify(response.data));
            let getData = response.data.data;
            let noOfGroup = this.state.guest;
            let expectedWaitingTime = this.state.exptime;
            let businessWaitlistSeatings = getData.businessWaitlistSeatings;
            for (i = 0; i < businessWaitlistSeatings.length; i++) {
                businessWaitlistSeatings[i].isDeleted = true
            }
            for (i = 0; i < noOfGroup.length; i++) {
                if (noOfGroup[i].exptime == getData.groupSize) {
                    noOfGroup[i].selected = true
                }
            }

            for (i = 0; i < expectedWaitingTime.length; i++) {
                if (expectedWaitingTime[i].exptime == getData.waitTime) {
                    expectedWaitingTime[i].selected = true
                }
            }
            this.setState({
                waitListDetails: getData,
                businessWaitlistSeatings: businessWaitlistSeatings,
                guest: noOfGroup,
                exptime: expectedWaitingTime,
                customeTextInput: getData.businessWaitlistOthers
            }, () => {
                console.log("wait list data", this.state.businessWaitlistSeatings);
            })
        })
    }

    getAddi = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        let buseinssId = this.state.busId
        await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlistForm?businessId=" + buseinssId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            this.setState({ noteShow: re.data.data.quickNotes })
            this.setState({ tableShow: re.data.data.tableNo })
            if (re.data.data.waitListFormOthers.length != 0) {
                this.setState({ custome: re.data.data.waitListFormOthers })
                let newCus = this.state.lastCustome;
                re.data.data.waitListFormOthers.map((item) => {
                    let data = {
                        "id": 0,
                        "waitListFormOtherId": item.id,
                        "formValue": ""
                    }
                    newCus.push(data)
                })
            }
        })
    }

    checkvist = async (text) => {
        let phone = checkPhone(text)
        if (phone.length != 10) {
            this.setState({ customerName: "", vistlist: null })
        }
        if (phone == true) {
            let token = await AsyncStorage.getItem("jwtoken")
            let buseinssId = this.state.busId
            await axios.get(basesUrl + "v1/Customer/GetCustomer?contactNo=" + text + "&businessId=" + buseinssId, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }).then((re) => {
                if (re.data.data != null) {
                    this.setState({ vistlist: re.data.data })
                    this.setState({ customerId: re.data.data.id })
                    this.setState({ customerName: re.data.data.name, customnameerror: false })
                }
            })
        }
    }


    getseatingactivelist = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        let buseinssId = this.state.busId
        await axios.get(basesUrl + "v1/Businesses/GetActiveBusinessSeatingID?businessId=" + buseinssId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data.data);
            var seatingData = re.data.data;
            for (var i = 0; i < seatingData.length; i++) {
                for (var j = 0; j < this.state.businessWaitlistSeatings.length; j++) {
                    if (seatingData[i].id == this.state.businessWaitlistSeatings[j].businessesSeatingsId) {
                        seatingData[i].isDeleted = true
                    }
                }
            }
            this.setState({ areaList: seatingData });
        })
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
    }


    prefArea = (i, item) => {
        // let newArray = this.state.prefArray
        let selectUnselectitem = this.state.areaList.map((items, index) => {
            if (i == index) {
                items.isDeleted = !items.isDeleted;
            }
            return { ...items }
        })

        this.setState({ areaList: selectUnselectitem })

    }


    exptime = (i) => {
        let selectUnselectitem = this.state.exptime.map((item, index) => {
            if (i == index) {
                item.selected = true;
                this.setState({ exptimes: 0 })
                this.setState({ expadd: item.exptime })
                this.setState({ waittimeselect: true })
            }
            else {
                item.selected = false
            }
            return { ...item }
        })
        this.setState({ exptime: selectUnselectitem })
    }

    guestText = (text) => {
        this.setState({ guestCheck: 0 })
        this.setState({ guestDone: true })
        this.guest(this.state.guest.length + 1)
        const data = text.replace(/[ `@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/~]/gi, '')
        this.setState({ guestNo: data })
        this.setState({ adult: data })
        this.setState({ kids: 0, disable: 0 })
    }

    exptimeText = (text) => {
        this.exptime(this.state.exptime.length + 1)
        const data = text.replace(/[ `@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/~]/gi, '')
        this.setState({ exptimes: data })
        this.setState({ waittimeselect: true })
        this.setState({ expadd: 0 })
    }


    kidsguest = () => {
        if (this.state.adult != 0) {
            this.setState({ kids: this.state.kids + 1 })
            this.setState({ adult: this.state.adult - 1 })
        } else if (this.state.disable != 0) {
            this.setState({ kids: this.state.kids + 1 })
            this.setState({ disable: this.state.disable - 1 })
        }
    }

    disableguest = () => {
        if (this.state.adult != 0) {
            this.setState({ disable: this.state.disable + 1 })
            this.setState({ adult: this.state.adult - 1 })
        } else if (this.state.kids != 0) {
            this.setState({ disable: this.state.disable + 1 })
            this.setState({ kids: this.state.kids - 1 })
        }
    }


    adultguest = () => {
        if (this.state.kids != 0) {
            this.setState({ kids: this.state.kids - 1 })
            this.setState({ adult: this.state.adult + 1 })
        } else if (this.state.disable != 0) {
            this.setState({ disable: this.state.disable - 1 })
            this.setState({ adult: this.state.adult + 1 })
        }

    }

    walk = () => {
        if (this.state.reservation == true) {
            this.setState({ walkIn: true, reservation: false, prefArray: [], phone: '', customerName: "", guestCheck: 0, guestNo: 0, adult: 0, kids: 0, disable: 0, exptimes: 0, vistlist: null, waittimeselect: null, shotim: false })
            let selectUnselectitem = this.state.guest.map((item, index) => {
                if (item.selected == true) {
                    item.selected = false;
                }
                else {
                    item.selected = false
                }
                return { ...item }
            })
            this.setState({ guest: selectUnselectitem })
            let newArray = this.state.prefArray
            let areaselect = this.state.areaList.map((items, index) => {
                if (items.isDeleted == true) {
                    items.isDeleted = false;
                }
                return { ...items }
            })

            this.setState({ areaList: areaselect })
            let expactTime = this.state.exptime.map((item, index) => {
                if (item.selected == true) {
                    item.selected = false;
                }
                else {
                    item.selected = false
                }
                return { ...item }
            })
            this.setState({ exptime: expactTime })
        }
    }
    reserv = () => {
        if (this.state.walkIn == true) {
            this.setState({ reservation: true, walkIn: false, prefArray: [], phone: '', customerName: "", guestCheck: 0, guestNo: 0, adult: 0, kids: 0, disable: 0, exptimes: 0, vistlist: null, expadd: 0, waittimeselect: null })
            let selectUnselectitem = this.state.guest.map((item, index) => {
                if (item.selected == true) {
                    item.selected = false;
                }
                else {
                    item.selected = false
                }
                return { ...item }
            })
            this.setState({ guest: selectUnselectitem })
            let newArray = this.state.prefArray
            let areaselect = this.state.areaList.map((items, index) => {
                if (items.isDeleted == true) {
                    items.isDeleted = false;
                }
                return { ...items }
            })

            this.setState({ areaList: areaselect })
            let expactTime = this.state.exptime.map((item, index) => {
                if (item.selected == true) {
                    item.selected = false;
                }
                else {
                    item.selected = false
                }
                return { ...item }
            })
            this.setState({ exptime: expactTime })
        }
    }

    customef = (text, item) => {
        this.state.lastCustome.map((value) => {
            if (value.waitListFormOtherId == item.id) {
                value.formValue = text
            }
            return { ...value }
        })
    }

    submit = async () => {
        if (this.state.exptimes == 0 && this.state.expadd == 0) {
            this.setState({ guestDoness: false })
        }
        if (this.state.guestDoness == true) {
            let token = await AsyncStorage.getItem("jwtoken");
            let businessWaitlistId = await AsyncStorage.getItem("businessWaitlistId");
            let data = {
                "id": businessWaitlistId,
                "notes": this.state.Notes == "" || this.state.Notes == null ? this.state.waitListDetails.notes : this.state.Notes,
                "waitTime": this.state.exptimes == 0 ? this.state.expadd : this.state.exptimes,
                "tableNoValue": this.state.table == "" || this.state.table == null ? this.state.waitListDetails.tableNoValue : this.state.table
            }

            await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateWaitlistTime", data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }).then((response) => {
                this.setState({
                    updateModal: false
                }, () => {
                    this.props.navigation.navigate("Home")
                })
            })
        } else {
            console.log("xxnx");
        }
    }

    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View>
                            <View style={{ height: "100%", backgroundColor: '#EDEDF4', }}>
                                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? 'padding' : ''}>
                                    <View>
                                        {
                                            this.state.apisuccessstatus == true ? (<View style={{ marginTop: Platform.OS == "ios" && this.state.width < 769 ? "8%" : 0, backgroundColor: this.state.registerSuccess == true ? "#067655" : "#FF0000", justifyContent: 'center', alignItems: "center", }}>
                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>{this.state.apierrormessage}</Text>
                                            </View>) : null
                                        }
                                        <View>
                                            <View style={{ backgroundColor: '#000000', paddingHorizontal: this.state.width < 769 ? 10 : 30, paddingVertical: 10, paddingTop: 30, }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Platform.OS == "ios" ? 10 : 5, marginTop: Platform.OS == "ios" ? 20 : 0, }}>
                                                    <Pressable
                                                        onPress={() => this.props.navigation.navigate("Home")}
                                                    >
                                                        <Image
                                                            source={require('../Assets/icon-back-01.png')}
                                                            style={{ width: this.state.width < 769 ? 24 : 40, height: this.state.width < 769 ? 12 : 20, marginTop: 0, }}
                                                        />
                                                    </Pressable>
                                                    <Text style={{ color: '#ffffff', fontSize: 24, fontFamily: 'Poppins-Medium' }}>Wait Time</Text>
                                                    <View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{
                                                height: this.state.width < 769 ? "82%" : "85%", margin: this.state.width < 769 ? 10 : 20, backgroundColor: 'white', borderRadius: 10
                                            }}>
                                                <KeyboardAvoidingView behavior='padding'>
                                                    <ScrollView>
                                                        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: this.state.width < 769 ? 10 : 23, margin: 10, paddingHorizontal: this.state.width < 769 ? 15 : 23 }}>

                                                            <View style={{ flexDirection: this.state.width < 769 ? "column" : "row" }}>
                                                                <View style={{ width: this.state.width < 769 ? '100%' : "49%" }}>
                                                                    <TextInput
                                                                        placeholder='Enter Phone No.'
                                                                        placeholderTextColor={'#000000'}
                                                                        maxLength={10}
                                                                        value={this.state.waitListDetails.customerPhone}
                                                                        onChangeText={(text) => { this.setState({ phone: text, customephoneerror: false, phonempty: false }), this.checkvist(text) }}
                                                                        keyboardType='numeric'
                                                                        selectionColor={'#067655'}
                                                                        editable={false}
                                                                        style={{ backgroundColor: '#EDEDF4', borderRadius: 7, fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-Regular', height: this.state.width < 769 ? 45 : 60, padding: 0, paddingHorizontal: 15, width: this.state.width < 769 ? '100%' : "100%", color: '#000000' }}
                                                                    />
                                                                    {
                                                                        this.state.customephoneerror == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2 }}>
                                                                            <Text style={{ color: 'white' }}>Please enter correct phone no.</Text>
                                                                        </View>) : this.state.phonempty == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2 }}>
                                                                            <Text style={{ color: 'white' }}>Phone no required</Text>
                                                                        </View>) : null
                                                                    }
                                                                </View>
                                                                <View style={{ width: this.state.width < 769 ? '100%' : "49%" }}>
                                                                    <TextInput
                                                                        placeholder='Enter Name'
                                                                        placeholderTextColor={'#000000'}
                                                                        value={this.state.waitListDetails.customerName}
                                                                        maxLength={30}
                                                                        editable={false}
                                                                        selectionColor={'#067655'}
                                                                        onChangeText={(text) => this.setState({ customerName: text, customnameerror: false })}
                                                                        multiline={false}
                                                                        style={{ backgroundColor: '#EDEDF4', borderRadius: 7, fontSize: this.state.width < 769 ? 16 : 20, fontFamily: 'Poppins-Regular', height: this.state.width < 769 ? 45 : 60, padding: 0, paddingHorizontal: 15, width: this.state.width < 769 ? '100%' : "100%", color: '#000000', marginTop: this.state.width < 769 ? 10 : 0, marginLeft: this.state.width < 769 ? 0 : 20 }}
                                                                    />
                                                                    {
                                                                        this.state.customnameerror == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, marginLeft: this.state.width < 769 ? 0 : 20, width: this.state.width < 769 ? "100%" : "100%" }}>
                                                                            <Text style={{ color: 'white' }}>Name is required</Text>
                                                                        </View>) : null
                                                                    }
                                                                </View>
                                                            </View>

                                                            <View style={{ marginTop: "5%", marginLeft: this.state.width < 769 ? 0 : 0 }}>
                                                                <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                    {
                                                                        this.state.guestDone == false ? (<Image
                                                                            source={require('../Assets/red-code.png')}
                                                                            style={{ width: 16, height: 16, marginTop: Platform.OS == "android" ? -2 : 1 }}
                                                                        />) : null
                                                                    }
                                                                    <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>No. Of Guest</Text>
                                                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                </View>

                                                                <View style={{ flexDirection: this.state.width < 769 ? 'column' : "row" }}>
                                                                    <View style={{ flexDirection: 'row', width: this.state.width < 769 ? '101.5%' : "45%", flexWrap: 'wrap', justifyContent: this.state.width < 769 ? "space-between" : "flex-start", marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                                        {
                                                                            this.state.guest.map((item, i) =>
                                                                                <View
                                                                                    style={{ backgroundColor: item.selected == true ? "#067655" : '#FFFFFF', borderWidth: item.selected == true ? 0 : 2, borderColor: item.selected == true ? "#067655" : '#000000', borderRadius: 66, width: 60, height: item.id == 9 ? 42 : 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10 }}>
                                                                                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', color: item.selected == true ? "#FFFFFF" : '#3B3B3B' }}>{item.exptime}</Text>
                                                                                </View>
                                                                            )}

                                                                        <TextInput
                                                                            placeholder={this.state.waitListDetails.groupSize > 9 ? this.state.waitListDetails.groupSize.toString() : "Others"}
                                                                            placeholderTextColor={"#3B3B3B"}
                                                                            keyboardType="numeric"
                                                                            maxLength={2}
                                                                            multiline={true}
                                                                            numberOfLines={1}
                                                                            blurOnSubmit={true}
                                                                            selectionColor={'#067655'}
                                                                            editable={false}
                                                                            onChangeText={(text) => this.guestText(text)}
                                                                            style={{ paddingHorizontal: 14, paddingVertical: 0, fontSize: 20, fontFamily: 'OpenSans-Regular', color: '#3B3B3B', width: this.state.width < 769 ? '98%' : '87%', marginLeft: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRadius: 66, height: 38, marginTop: 10 }}
                                                                        />
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', marginTop: 13, justifyContent: "space-between", marginLeft: this.state.width < 769 ? 0 : 45 }}>
                                                                        <View>
                                                                            {
                                                                                this.state.waitListDetails.adults != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 29, borderRadius: 15, }}>
                                                                                    <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{this.state.waitListDetails.adults}</Text>
                                                                                </View>) : null
                                                                            }
                                                                            <Pressable
                                                                                onPress={() => this.adultguest()}
                                                                            >

                                                                                {
                                                                                    this.state.waitListDetails.adults != 0 ? (<Image
                                                                                        source={require('../Assets/icon-adults-active.png')}
                                                                                        style={{ width: this.state.width < 769 ? 94 : 107, height: this.state.width < 769 ? 105 : 120 }}
                                                                                    />) : (<Image
                                                                                        source={require('../Assets/icon-adults.png')}
                                                                                        style={{ width: this.state.width < 769 ? 94 : 107, height: this.state.width < 769 ? 105 : 120 }}
                                                                                    />)
                                                                                }

                                                                            </Pressable>
                                                                        </View>
                                                                        <View>
                                                                            {
                                                                                this.state.waitListDetails.children != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 29, borderRadius: 15, }}>
                                                                                    <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{this.state.waitListDetails.children}</Text>
                                                                                </View>) : null
                                                                            }
                                                                            <Pressable>

                                                                                {
                                                                                    this.state.waitListDetails.children != 0 ? (<Image
                                                                                        source={require('../Assets/ico-kids-active.png')}
                                                                                        style={{ width: this.state.width < 769 ? 94 : 107, height: this.state.width < 769 ? 105 : 120, marginLeft: 10 }}
                                                                                    />) : (<Image
                                                                                        source={require('../Assets/ico-Kids.png')}
                                                                                        style={{ width: this.state.width < 769 ? 94 : 107, height: this.state.width < 769 ? 105 : 120, marginLeft: 10 }}
                                                                                    />)
                                                                                }

                                                                            </Pressable>
                                                                        </View>
                                                                        <View>
                                                                            {
                                                                                this.state.waitListDetails.divyang != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 29, borderRadius: 15, }}>
                                                                                    <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{this.state.waitListDetails.divyang}</Text>
                                                                                </View>) : null
                                                                            }

                                                                            <Pressable
                                                                            // onPress={() => this.disableguest()}
                                                                            >

                                                                                {
                                                                                    this.state.waitListDetails.divyang != 0 ? (<Image
                                                                                        source={require('../Assets/ico-disabled-active.png')}
                                                                                        style={{ width: this.state.width < 769 ? 94 : 107, height: this.state.width < 769 ? 105 : 120, marginLeft: 10, }}
                                                                                    />) : (<Image
                                                                                        source={require('../Assets/ico-disabled.png')}
                                                                                        style={{ width: this.state.width < 769 ? 94 : 107, height: this.state.width < 769 ? 105 : 120, marginLeft: 10, }}
                                                                                    />)
                                                                                }

                                                                            </Pressable>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={{ marginTop: "5%", marginLeft: this.state.width < 769 ? 0 : 0 }}>
                                                                {
                                                                    this.state.businessWaitlistSeatings.length == 0 ? null :
                                                                        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Preferred Area</Text>
                                                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                        </View>
                                                                }
                                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                                    {
                                                                        this.state.businessWaitlistSeatings.map((item, i) =>
                                                                            <View
                                                                                style={{ backgroundColor: item.isDeleted == false ? '#FFFFFF' : "#067655", borderWidth: item.isDeleted == false ? 2 : 2, borderColor: item.isDeleted == false ? '#000000' : "#067655", borderRadius: 66, height: 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10, paddingVertical: 0, paddingVertical: 0, paddingHorizontal: this.state.width < 769 ? 12 : 15, paddingBottom: 4 }}>
                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, fontFamily: 'OpenSans-Regular', color: item.isDeleted == false ? '#3B3B3B' : "#FFFFFF" }}>{item.seatingArea}</Text>
                                                                            </View>
                                                                        )
                                                                    }

                                                                    {
                                                                        this.state.waitListDetails.notes == "" ?
                                                                            null :
                                                                            <View style={{ width: "100%" }}>
                                                                                <View style={{ alignSelf: "center", flexDirection: 'row', marginLeft: this.state.width < 769 ? "2%" : 0, alignItems: "center", justifyContent: "space-between", marginTop: "3%", width: this.state.width < 769 ? "97%" : "100%" }}>
                                                                                    <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Notes</Text>
                                                                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                                </View>

                                                                                <TextInput
                                                                                    placeholder={this.state.waitListDetails.notes == "" ? 'Notes' : this.state.waitListDetails.notes}
                                                                                    placeholderTextColor={'#000000'}
                                                                                    value={this.state.waitListDetails.notes == "" ? this.state.Notes : this.state.waitListDetails.notes}
                                                                                    onChangeText={(text) => this.setState({ Notes: text })}
                                                                                    selectionColor={'#067655'}
                                                                                    maxLength={100}
                                                                                    multiline={true}
                                                                                    style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, height: 90, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 10 : 0 }}
                                                                                />
                                                                            </View>
                                                                    }

                                                                    {
                                                                        this.state.waitListDetails.tableNoValue == "" ? null :
                                                                            <View>
                                                                                <View style={{ flexDirection: 'row', width: this.state.width < 769 ? "97%" : "100%", alignItems: "center", justifyContent: "space-between", marginTop: "2%", marginLeft: this.state.width < 769 ? "3%" : 0 }}>
                                                                                    <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Table No.</Text>
                                                                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                                </View>

                                                                                <TextInput
                                                                                    placeholder={this.state.waitListDetails.tableNoValue == "" ? 'Enter Table Number' : this.state.waitListDetails.tableNoValue}
                                                                                    placeholderTextColor={'#000000'}
                                                                                    value={this.state.table}
                                                                                    maxLength={3}
                                                                                    onChangeText={(text) => this.setState({ table: text })}
                                                                                    keyboardType="numeric"
                                                                                    selectionColor={'#067655'}
                                                                                    style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, height: 52, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 10 : 0 }}
                                                                                />
                                                                            </View>
                                                                    }

                                                                </View>
                                                            </View>
                                                            <View>
                                                                {
                                                                    this.state.walkIn == true ? (<View>
                                                                        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", marginTop: "5%", justifyContent: "space-between" }}>
                                                                            {
                                                                                this.state.guestDoness == false ? (<Image
                                                                                    source={require('../Assets/red-code.png')}
                                                                                    style={{ width: 16, height: 16, marginTop: Platform.OS == "android" ? -2 : 1 }}
                                                                                />) : null
                                                                            }
                                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Expected Waiting Time (Mins)</Text>
                                                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                        </View>

                                                                        <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap', justifyContent: this.state.width < 769 ? "space-between" : "flex-start", paddingRight: this.state.width < 769 ? 0 : null, marginLeft: this.state.width < 769 ? -10 : null }}>
                                                                            {
                                                                                this.state.exptime.map((item, i) =>
                                                                                    <Pressable
                                                                                        onPress={() => this.exptime(i)}
                                                                                        style={{ backgroundColor: item.selected == true ? "#067655" : '#FFFFFF', borderWidth: item.selected == true ? 0 : 2, borderColor: item.selected == true ? "#067655" : '#000000', borderRadius: 66, width: this.state.width < 769 ? 60 : 'auto', height: 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingHorizontal: 15, marginLeft: 10 }}>
                                                                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', color: item.selected == true ? "#FFFFFF" : '#3B3B3B' }}>{item.exptime}</Text>
                                                                                    </Pressable>
                                                                                )
                                                                            }
                                                                            <TextInput
                                                                                placeholder={"Others"}
                                                                                placeholderTextColor={"#3B3B3B"}
                                                                                value={this.state.exptimes}
                                                                                keyboardType='numeric'
                                                                                maxLength={2}
                                                                                multiline={true}
                                                                                numberOfLines={1}
                                                                                blurOnSubmit={true}
                                                                                selectionColor={'#067655'}
                                                                                onChangeText={(text) => this.exptimeText(text)}
                                                                                style={{ paddingHorizontal: 14, paddingVertical: 0, fontSize: 20, fontFamily: 'OpenSans-Regular', color: '#3B3B3B', width: this.state.width < 769 ? '97%' : 110, marginLeft: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRadius: 66, height: 38, marginTop: 10 }}
                                                                            />
                                                                        </View></View>) : null
                                                                }

                                                            </View>
                                                            {
                                                                this.state.customeTextInput.length !== 0 ? (
                                                                    <View style={{ marginTop: "5%", marginLeft: this.state.width < 769 ? 0 : 0 }}>
                                                                        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Custom Fields</Text>
                                                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                        </View>
                                                                        {
                                                                            this.state.customeTextInput.map((item, i) =>
                                                                                <TextInput
                                                                                    placeholder={item.formValue}
                                                                                    placeholderTextColor={'#000000'}
                                                                                    // value={this.state.cusValue}
                                                                                    // onChangeText={(text) => this.customef(text, item)}
                                                                                    selectionColor={'#067655'}
                                                                                    maxLength={60}
                                                                                    multiline={true}
                                                                                    editable={false}
                                                                                    style={{ backgroundColor: '#EDEDF4', borderRadius: 7, fontSize: this.state.width < 769 ? 16 : 20, fontFamily: 'Poppins-Regular', height: this.state.width < 769 ? 45 : 60, padding: 0, paddingHorizontal: 15, width: this.state.width < 769 ? '100%' : "100%", color: '#000000', marginTop: 10 }}
                                                                                />
                                                                            )
                                                                        }
                                                                    </View>) :
                                                                    null
                                                            }
                                                        </View>
                                                    </ScrollView>
                                                </KeyboardAvoidingView>
                                            </View>
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.exptimes == 0 && this.state.expadd == 0) {
                                            this.setState({
                                                guestDoness: false,
                                                updateModal: false
                                            })
                                        } else {
                                            this.setState({
                                                guestDoness: true,
                                                updateModal: true
                                            })
                                        }
                                    }}
                                    style={{ position: 'absolute', bottom: 0, backgroundColor: '#067655', width: '100%', paddingVertical: 15 }}>
                                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'OpenSans-SemiBold' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.updateModal}
                                onRequestClose={() => {
                                    this.setState({ updateModal: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: this.state.width < 769 ? "center" : "center",
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
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Are you sure want to update ?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                onPress={() => this.submit()}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                                <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.setState({ updateModal: false })}
                                                style={{ backgroundColor: 'black', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}
                                            >
                                                <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>No</Text>
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