import { Text, View, Image, TextInput, ScrollView, PermissionsAndroid, Pressable, BackHandler, Dimensions, ActivityIndicator, Modal, Platform, TouchableOpacity, Alert, AppState } from 'react-native'
import React, { Component } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { basesUrl } from '../../App';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { request, PERMISSIONS } from 'react-native-permissions';
import messaging from "@react-native-firebase/messaging";
import InternetCheck from '../InternetConnection/InternetCheck';
import NetInfo from "@react-native-community/netinfo";

export default class Home extends Component {

    NetInfoSubscribtion = null;

    constructor() {
        super();
        this.state = {
            waitList: [],
            waitList1: [
                {
                    "id": 1,
                    "customerPhone": "9654 888 654",
                    "customerName": "Mr. Sandeep Singh",
                    "place": "Outside",
                    "arrivedTime": "4:10 PM",
                    "note": "1 Senior guest",
                    "totalMember": "5",
                    "totalPartytime": 10,
                    "timeExceed": false,
                    "notify": {
                        "notifyTime": 2,
                        "lastNotify": "5m ago",
                        "timing": "4:30 PM"
                    },
                    "serialNO": 4,
                    "spendTime": 7,
                    "swipeChange": false,
                    "color": "green",
                    "member": "(4 Adults, 1Kid)"
                },
                {
                    "id": 2,
                    "customerPhone": "9654 888 654",
                    "customerName": "Mr. Sandeep Singh",
                    "place": "Outside",
                    "arrivedTime": "4:10 PM",
                    "note": "1 Senior guest",
                    "totalMember": "5",
                    "totalPartytime": 10,
                    "timeExceed": true,
                    "notify": {
                        "notifyTime": 2,
                        "lastNotify": "5m ago",
                        "timing": "4:30 PM"
                    },
                    "serialNO": 4,
                    "spendTime": 30,
                    "swipeChange": false,
                    "color": "red",
                    "member": "(4 Adults, 1Kid)"
                },
                {
                    "id": 3,
                    "customerPhone": "9654 888 654",
                    "customerName": "Mr. Sandeep Singh",
                    "place": "Outside",
                    "arrivedTime": "4:10 PM",
                    "note": "1 Senior guest",
                    "totalMember": "5",
                    "totalPartytime": 10,
                    "timeExceed": false,
                    "notify": {
                        "notifyTime": 2,
                        "lastNotify": "5m ago",
                        "timing": "4:30 PM"
                    },
                    "serialNO": 4,
                    "spendTime": 7,
                    "swipeChange": false,
                    "color": "green",
                    "member": "(4 Adults, 1Kid)",
                },
                {
                    "id": 4,
                    "customerPhone": "9654 888 654",
                    "customerName": "Mr. Sandeep Singh",
                    "place": "Outside",
                    "arrivedTime": "4:10 PM",
                    "note": "1 Senior guest",
                    "totalMember": "5",
                    "totalPartytime": 10,
                    "timeExceed": false,
                    "notify": {
                        "notifyTime": 2,
                        "lastNotify": "5m ago",
                        "timing": "4:30 PM"
                    },
                    "serialNO": 4,
                    "spendTime": 7,
                    "swipeChange": false,
                    "color": "green",
                    "member": "(4 Adults, 1Kid)"
                },
                {
                    "id": 5,
                    "customerPhone": "9654 888 654",
                    "customerName": "Mr. Sandeep Singh",
                    "place": "Outside",
                    "arrivedTime": "4:10 PM",
                    "note": "1 Senior guest",
                    "totalMember": "4",
                    "totalPartytime": 10,
                    "timeExceed": false,
                    "notify": {
                        "notifyTime": 2,
                        "lastNotify": "5m ago",
                        "timing": "4:30 PM"
                    },
                    "serialNO": 4,
                    "spendTime": 7,
                    "swipeChange": false,
                    "color": "green",
                    "member": "(3 Adults, 1Kid)"
                },
                {
                    "id": 6,
                    "customerPhone": "9654 888 654",
                    "customerName": "Mr. Sandeep Singh",
                    "place": "Outside",
                    "arrivedTime": "4:10 PM",
                    "note": "1 Senior guest",
                    "totalMember": "4",
                    "totalPartytime": 10,
                    "timeExceed": true,
                    "notify": {
                        "notifyTime": 2,
                        "lastNotify": "5m ago",
                        "timing": "4:30 PM"
                    },
                    "serialNO": 4,
                    "spendTime": 30,
                    "swipeChange": false,
                    "color": "red",
                    "member": "(3 Adults, 1Kid)"
                }
            ],
            openChange: false,
            search: '',
            getAllgreen: false,
            topSection: [
                {
                    "id": 1,
                    "totalMembar": 5,
                    "list": 3,
                    "color": 'green',
                },
                {
                    "id": 2,
                    "totalMembar": 4,
                    "list": 1,
                    "color": 'green',
                },
                {
                    "id": 3,
                    "totalMembar": 5,
                    "list": 1,
                    "color": 'red',
                },
                {
                    "id": 4,
                    "totalMembar": 4,
                    "list": 1,
                    "color": 'red',
                },

            ],
            totalMembar: "",
            color: "",
            searchShow: false,
            timeShow: false,
            width: "",
            busId: 0,
            cureTime: "",
            topScroll: [],
            getfilterValue: [],
            qrCode: "",
            loader: false,
            openModel: false,
            swipeId: 0,
            modeltimeex: 0,
            modaladd: false,
            apisuccessstatus: false,
            apierrormessage: "",
            failderror: false,
            loc: false,
            modaladdcan: false,
            nodataa: "",
            closetime: false,
            endTime: new Date(),
            newNotification: "",
            customValueShow: false,
            connection_status: false,
        }
    }


    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        this.getNotification();
        this.props.navigation.addListener('focus', () => this.refreshFun());
        this.getQr()
        let ss = await AsyncStorage.getItem("businessId")
        this.setState({ busId: ss })
        setTimeout(() => { this.setState({ timeShow: true }) }, 1000)
        let width = Dimensions.get("screen").width
        this.setState({ width: width })
        this.getListss();
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
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    }


    getNotification = () => {
        messaging().onMessage(async (remoteMessage) => {
            console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
            if (remoteMessage) {
                this.getListss();
            }
        })
    }

    refreshFun = async () => {
        let qr = await AsyncStorage.getItem("qrId")
        if (qr != "null") {
            this.getqrcode()
        } else {
            this.getListss()
        }
    }


    requestCameraPermission = async () => {
        if (Platform.OS == "ios") {
            request(PERMISSIONS.IOS.CAMERA).then((result) => {
                if (result == "granted") {
                    this.props.navigation.navigate("Validation");
                } else {
                    this.setState({
                        loader: false
                    })
                }
            });
        }
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.props.navigation.navigate("Validation");
                } else {
                    this.setState({
                        loader: false
                    })
                }
            } catch (err) {
                console.log(err);
            }
        }
    };


    getList = async () => {
        const listDate = [
            {
                "id": 1,
                "customerPhone": "9654 888 654",
                "customerName": "Mr. Sandeep Singh",
                "place": "Outside",
                "arrivedTime": "4:10 PM",
                "note": "1 Senior guest",
                "totalMember": "5",
                "totalPartytime": 10,
                "timeExceed": false,
                "notify": {
                    "notifyTime": 2,
                    "lastNotify": "5m ago",
                    "timing": "4:30 PM"
                },
                "serialNO": 4,
                "spendTime": 7,
                "swipeChange": false,
                "color": "green",
                "member": "(4 Adults, 1Kid)"
            },
            {
                "id": 2,
                "customerPhone": "9654 888 654",
                "customerName": "Mr. Sandeep Singh",
                "place": "Outside",
                "arrivedTime": "4:10 PM",
                "note": "1 Senior guest",
                "totalMember": "5",
                "totalPartytime": 10,
                "timeExceed": true,
                "notify": {
                    "notifyTime": 2,
                    "lastNotify": "5m ago",
                    "timing": "4:30 PM"
                },
                "serialNO": 4,
                "spendTime": 30,
                "swipeChange": false,
                "color": "red",
                "member": "(4 Adults, 1Kid)"
            },
            {
                "id": 3,
                "customerPhone": "9654 888 654",
                "customerName": "Mr. Sandeep Singh",
                "place": "Outside",
                "arrivedTime": "4:10 PM",
                "note": "1 Senior guest",
                "totalMember": "5",
                "totalPartytime": 10,
                "timeExceed": false,
                "notify": {
                    "notifyTime": 2,
                    "lastNotify": "5m ago",
                    "timing": "4:30 PM"
                },
                "serialNO": 4,
                "spendTime": 7,
                "swipeChange": false,
                "color": "green",
                "member": "(4 Adults, 1Kid)",
            },
            {
                "id": 4,
                "customerPhone": "9654 888 654",
                "customerName": "Mr. Sandeep Singh",
                "place": "Outside",
                "arrivedTime": "4:10 PM",
                "note": "1 Senior guest",
                "totalMember": "5",
                "totalPartytime": 10,
                "timeExceed": false,
                "notify": {
                    "notifyTime": 2,
                    "lastNotify": "5m ago",
                    "timing": "4:30 PM"
                },
                "serialNO": 4,
                "spendTime": 7,
                "swipeChange": false,
                "color": "green",
                "member": "(4 Adults, 1Kid)"
            },
            {
                "id": 5,
                "customerPhone": "9654 888 654",
                "customerName": "Mr. Sandeep Singh",
                "place": "Outside",
                "arrivedTime": "4:10 PM",
                "note": "1 Senior guest",
                "totalMember": "4",
                "totalPartytime": 10,
                "timeExceed": false,
                "notify": {
                    "notifyTime": 2,
                    "lastNotify": "5m ago",
                    "timing": "4:30 PM"
                },
                "serialNO": 4,
                "spendTime": 7,
                "swipeChange": false,
                "color": "green",
                "member": "(3 Adults, 1Kid)"
            },
            {
                "id": 6,
                "customerPhone": "9654 888 654",
                "customerName": "Mr. Sandeep Singh",
                "place": "Outside",
                "arrivedTime": "4:10 PM",
                "note": "1 Senior guest",
                "totalMember": "4",
                "totalPartytime": 10,
                "timeExceed": true,
                "notify": {
                    "notifyTime": 2,
                    "lastNotify": "5m ago",
                    "timing": "4:30 PM"
                },

                "serialNO": 4,
                "spendTime": 30,
                "swipeChange": false,
                "color": "red",
                "member": "(3 Adults, 1Kid)"
            },

        ];
        const newArray = listDate.map(e => {
            return {
                ...e,
                selected: false
            }
        })
        this.setState({
            waitList: newArray
        })

    }

    getqrcode = async () => {
        let qr = await AsyncStorage.getItem("qrId")
        this.setState({ qrCode: qr })

        if (qr != "null") {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)
            time = new Date(time).toJSON()
            this.setState({ cureTime: time })
            let token = await AsyncStorage.getItem("jwtoken")
            let buseinssId = this.state.busId
            let dateforApi = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()

            await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlist?businessId=" + buseinssId + "&waitListDate=" + dateforApi + "&currentDataTime=" + this.state.cureTime + "&qRCode=" + this.state.qrCode, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'application/json-patch+json'
                }
            }).then((re) => {
                AsyncStorage.setItem("qrId", "null")
                this.setState({ qrCode: "null" })

                if (re.data.data.businessWaitlistResponses.length == 0) {
                    this.setState({ nodataa: "No Wait List Avaliable" })
                } else {
                    this.setState({ nodataa: "" })
                }
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
        }
    }
    insertTag = (keyIndex, rowId) => {

        let selectUnselectitem = this.state.waitList.map((item, index) => {
            if (keyIndex == index) {
                item.selected = true;
            }
            else {
                rowId[index].closeRow();
                item.selected = false
            }
            return { ...item }
        })
        this.setState({ waitList: selectUnselectitem })
    }

    closeTag = (keyIndex, rowId) => {

        let selectUnselectitem = this.state.waitList.map((item, index) => {
            if (keyIndex == index) {
                item.selected = false;
            }
            return { ...item }
        })
        this.setState({ waitList: selectUnselectitem })
    }


    getAll = () => {
        this.setState({ waitList: this.state.getfilterValue, search: "" })
    }

    getAllg = (items) => {

        let newArrey = []
        let totalMembars = items.totalMembar
        let color = items.color
        let selectUnselectitem = this.state.waitList1.map((item, index) => {
            if (item.totalMember == totalMembars && item.color == color) {

                newArrey.push(item)
            } else if (item.totalMember == totalMembars && item.notify == true) {
                newArrey.push(item)
            }
            return { ...item }
        })

        this.setState({ waitList: newArrey })
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
        let dateforApi = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
        await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlist?businessId=" + buseinssId + "&waitListDate=" + dateforApi + "&currentDataTime=" + this.state.cureTime, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            this.setState({ topScroll: re.data.data.waitListSliders })
            if (re.data.data.businessWaitlistResponses.length == 0) {
                this.setState({ nodataa: "No Wait List Avaliable" })
            } else {
                this.setState({ nodataa: "" })
            }
            const newArray = re.data.data.businessWaitlistResponses.map(e => {
                return {
                    ...e,
                    selected: false
                }
            })
            this.setState({
                waitList: newArray
            }, () => {
                console.log(JSON.stringify(this.state.waitList));
            })
            this.setState({
                getfilterValue: newArray,
                newNotification: re.data.data.newNotification
            })
        })
    }

    counterTime = (data) => {
        if (data.item.isReservation != true) {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)
            var diff = (new Date(data.item.reservation).getTime() - new Date().getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        } else {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)
            var diff = (new Date(data.item.reservation).getTime() - new Date(time).getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        }
    }


    cancelsss = async (data) => {
        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time)
        let token = await AsyncStorage.getItem("jwtoken")
        let datas = {
            "id": data.item.id,
            "status": 5,
            "currentDataTime": time
        }
        let selectUnselectitem = this.state.waitList.map((item, index) => {
            if (data.item.id == index.id) {
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
            if (re.data.succeeded != true) {
                this.setState({ apisuccessstatus: true })
                this.setState({ apierrormessage: "Something is wrong" })
            } else {
                this.setState({ apisuccessstatus: true })
                this.setState({ apierrormessage: "cancel successfully" })
                // this.setState({ openModel: false })
                this.setState({ waitList: [], loader: true })
                setTimeout(() => {
                    this.setState({ apisuccessstatus: false })
                    this.setState({ apierrormessage: "" })
                    this.getListss()
                    this.setState({ loader: false })
                }, 1000)
            }
        })
    }

    Notification = async (data, rowId, rowMap) => {
        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time)
        let token = await AsyncStorage.getItem("jwtoken")
        let datadd = {
            "id": data.item.id,
            "status": 2,
            "currentDataTime": time
        }
        await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateWaitlistStatus", datadd, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            if (re.data.succeeded != true) {
                this.setState({ loc: true })
                this.setState({ apierrormessage: re.data.message })
            } else {
                this.setState({ apisuccessstatus: true })
                this.setState({ apierrormessage: "Notify successfully" })
                // this.setState({ openModel: false })
                this.setState({ waitList: [], loader: true })
                setTimeout(() => {
                    this.setState({ apisuccessstatus: false, failderror: false })
                    this.setState({ apierrormessage: "" })
                    this.setState({ waitList: [], loader: true })
                    this.getListss()
                    this.setState({ loader: false })
                }, 1000)
            }

            // this.setState({ waitList: [], loader: true })
            // setTimeout(() => {
            //     this.getListss()
            //     this.setState({ loader: false })
            // }, 500)
            // this.setState({loader: false})
        })
    }
    checkOff = async () => {
        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time)
        let token = await AsyncStorage.getItem("jwtoken")
        let datadd = {
            "id": this.state.swipeId,
            "status": 3,
            "currentDataTime": time
        }
        await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateWaitlistStatus", datadd, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {

            this.setState({ modaladd: false })
            this.setState({ waitList: [], loader: true })
            setTimeout(() => {
                this.getListss()
                this.setState({ loader: false })
            }, 500)
        })
    }
    getQr = async () => {
        setTimeout(async () => {
            let qr = await AsyncStorage.getItem("qrId")
        }, 2000);

    }

    getAllgsdd = (items) => {
        let filterArry = []
        items.waitListIds.map((value) => {
            this.state.getfilterValue.map((it) => {
                if (it.id == value) {
                    filterArry.push(it)
                }
            })
        })

        // this.setState({getfilterValue: filterArry})
        this.setState({ waitList: filterArry })
    }

    searchFilter = async (text) => {
        this.setState({
            search: text
        })
        if (text.length >= 3) {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)
            time = new Date(time).toJSON()
            this.setState({ cureTime: time })
            let token = await AsyncStorage.getItem("jwtoken")
            let buseinssId = this.state.busId
            let dateforApi = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
            await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlist?businessId=" + buseinssId + "&waitListDate=" + dateforApi + "&currentDataTime=" + this.state.cureTime + "&search=" + text, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'application/json-patch+json'
                }
            }).then((re) => {
                this.setState({ topScroll: re.data.data.waitListSliders })
                if (re.data.data.businessWaitlistResponses.length == 0) {
                    this.setState({ nodataa: "No Wait List Avaliable" })
                } else {
                    this.setState({ nodataa: "" })
                }
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
        } else {
            this.getListss();
        }
    }

    ArriveTime = (data) => {
        let fullTime = new Date(data.item.reservation)
        fullTime = fullTime.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })
        return fullTime
    }

    notifs = (data) => {
        let notifyTime = new Date(data.item.lastNotifyAt)
        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        var diff = (new Date(data.item.lastNotifyAt).getTime() - new Date().getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    lastTime = (data) => {
        let datas = "(" + new Date(data.item.lastNotifyAt).getHours() + ":" + new Date(data.item.lastNotifyAt).getMinutes() + ")"
        return datas;
    }

    seatingarea = (data) => {
        let seatingle = data.item.businessWaitlistSeatings
        if (seatingle.length != 0) {
            if (data.item.businessWaitlistSeatings[0].seatingArea.length < 4) {
                return data.item.businessWaitlistSeatings[0].seatingArea
            } else {
                return data.item.businessWaitlistSeatings[0].seatingArea.slice(0, 5) + ".."
            }
        } else {
            return null
        }
    }
    setMo = (data) => {
        this.setState({ openModel: true, swipeId: data.item.id })
    }
    counterTimeModel = (resutl) => {
        if (resutl.isReservation != true) {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)
            var diff = (new Date(resutl.reservation).getTime() - new Date().getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        } else {
            let time = new Date()
            time.setHours(time.getHours() + 5)
            time = new Date(time)
            time.setMinutes(time.getMinutes() + 30)
            var diff = (new Date(resutl.reservation).getTime() - new Date(time).getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        }
    }
    ArriveTimeModel = (result) => {
        let fullTime = new Date(result.reservation)
        fullTime = fullTime.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })
        return fullTime
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
            if (re.data.succeeded != true) {
                this.setState({ apisuccessstatus: true })
                this.setState({ apierrormessage: "somthing is wrong" })
            } else {
                this.setState({ apisuccessstatus: true, modaladdcan: false })
                this.setState({ apierrormessage: "cancel successfully" })
                this.setState({ openModel: false })
                this.setState({ waitList: [], loader: true })
                setTimeout(() => {
                    this.setState({ apisuccessstatus: false })
                    this.setState({ apierrormessage: "" })
                    this.getListss()
                    this.setState({ loader: false })
                }, 1000)
            }
        })
    }

    NotificationModal = async () => {
        let time = new Date();
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time)

        let token = await AsyncStorage.getItem("jwtoken")
        let datadd = {
            "id": this.state.swipeId,
            "status": 2,
            "currentDataTime": time
        }
        await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateWaitlistStatus", datadd, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            if (re.data.succeeded != true) {
                this.setState({ loc: true, openModel: false })
                this.setState({ apierrormessage: re.data.message })
            } else {
                this.setState({ apisuccessstatus: true })
                this.setState({ apierrormessage: "Notify successfully" })
                setTimeout(() => {
                    this.setState({ apisuccessstatus: false, failderror: false })
                    this.setState({ apierrormessage: "" })
                    this.setState({ openModel: false })
                    this.setState({ waitList: [], loader: true })
                    this.getListss()
                    this.setState({ loader: false })
                }, 1000)
            }
        })
    }


    checkOffModal = async () => {

        let time = new Date()
        time.setHours(time.getHours() + 5)
        time = new Date(time)
        time.setMinutes(time.getMinutes() + 30)
        time = new Date(time)
        let token = await AsyncStorage.getItem("jwtoken")
        let datadd = {
            "id": this.state.swipeId,
            "status": 3,
            "currentDataTime": time
        }
        await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateWaitlistStatus", datadd, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            this.setState({ openModel: false, modaladd: false, modaladdcan: false })
            this.setState({ waitList: [], loader: true })
            setTimeout(() => {
                this.getListss()
                this.setState({ loader: false })
            }, 500)
        })
    }

    getCom = (data) => {
        this.setState({ modaladd: true, swipeId: data.item.id })
    }
    clickOpen = (data) => {

    }


    modgetCom = () => {
        this.setState({ modaladd: true, openModel: false })
    }

    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View style={{ backgroundColor: '#EDEDF4', height: "100%" }}>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.loc}
                                onRequestClose={() => {
                                    this.setState({ loc: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
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
                                        justifyContent: "center",
                                        alignItems: 'center'
                                    }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
                                            <Image
                                                source={require('../Assets/red-code.png')}
                                                style={{ width: 34, height: 34, marginTop: 0, }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>{this.state.apierrormessage}</Text>
                                            {/* <View style={{ marginTop: 5 }}>
                                    <Text>Latitude: {this.state.Latitude}</Text>
                                    <Text>Longitude: {this.state.Longitude}</Text>
                                </View> */}
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                                            <Pressable
                                                onPress={() => this.setState({ loc: false, openModel: false })}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 15 }}
                                            >
                                                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'OpenSans-Bold' }}>OK</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            {
                                this.state.apisuccessstatus == true ? (<View style={{ marginTop: Platform.OS == "ios" && this.state.width < 769 ? "8%" : 0, backgroundColor: this.state.failderror == true ? "#B10808" : "#067655", justifyContent: 'center', alignItems: "center", }}>
                                    <Text style={{ fontSize: this.state.width < 769 ? 12 : 15, textAlign: 'center', marginVertical: 5, color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>{this.state.apierrormessage}</Text>
                                </View>) : null
                            }
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.modaladd}
                                onRequestClose={() => {
                                    this.setState({ modaladd: false });
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
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Would you like to Check-off ?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                onPress={() => this.checkOff()}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                                <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.setState({ modaladd: false })}
                                                style={{ backgroundColor: 'black', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}
                                            >
                                                <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>No</Text>
                                            </Pressable>

                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <View style={{ backgroundColor: '#000000', paddingHorizontal: this.state.width < 769 ? 10 : 30, }}>
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop:
                                        Platform.OS == "ios" ? 50 : 28, height: 45
                                }}>
                                    <Pressable
                                        onPress={() => this.props.navigation.navigate("Navbar")}
                                        style={{ width: '10%' }}
                                    >
                                        <Image
                                            source={require('../Assets/hamburger.png')}
                                            style={{ width: this.state.width < 769 ? 25 : 36, height: this.state.width < 769 ? 25 : 36 }}
                                        />
                                    </Pressable>
                                    <Pressable onPress={() => this.props.navigation.navigate("Notification")} style={{ marginTop: "0.5%" }}>
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <Image
                                                source={require('../Assets/Notification.png')}
                                                style={{ width: this.state.width < 769 ? 23 : 30, height: this.state.width < 769 ? 20 : 30 }}
                                                resizeMode={"contain"}
                                            />
                                            {
                                                this.state.newNotification == 0 ? null :
                                                    <View style={{ backgroundColor: "red", borderRadius: 50, height: 15, width: 16, marginTop: -5, marginLeft: -10, alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>{this.state.newNotification}</Text>
                                                    </View>
                                            }
                                        </View>
                                    </Pressable>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: this.state.width < 769 ? "72%" : "60%" }}>
                                        {
                                            this.state.searchShow == true ? (<TextInput
                                                onChangeText={(text) => this.searchFilter(text)}
                                                placeholder='Search'
                                                maxLength={20}
                                                style={{ backgroundColor: 'white', color: 'black', fontSize: 14, width: "100%", padding: 0, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, fontFamily: 'Poppins-Medium' }}
                                                placeholderTextColor="black" />) :
                                                (<Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, marginTop: 0, fontFamily: 'Poppins-Medium', marginLeft: this.state.width < 769 ? -15 : 60 }}>Waiting List {this.state.waitList.length != 0 ? "(" + this.state.waitList.length.toString() + ")" : null}</Text>)
                                        }

                                    </View>
                                    {
                                        this.state.width < 769 ? (
                                            <Pressable
                                                onPress={() => this.setState({ searchShow: !this.state.searchShow })}
                                                style={{}}>
                                                {
                                                    this.state.searchShow == true ? (<Image
                                                        source={require('../Assets/ico-close-mobile.png')}
                                                        style={{ width: 20, height: 20, marginTop: 5 }}
                                                    />) : (<Image
                                                        source={require('../Assets/ico-search-mobile.png')}
                                                        style={{ width: 25, height: 25 }}
                                                    />)
                                                }
                                                {/* <Text style={{ fontSize: 15, color: '#FFFFFF', fontFamily: 'Poppins-SemiBold' }}>Add New</Text> */}
                                            </Pressable>
                                        ) : (
                                            <Pressable
                                                onPress={() => this.props.navigation.navigate("Addnew")}
                                                style={{ backgroundColor: "#067655", paddingVertical: 5, paddingHorizontal: 23, borderRadius: 127 }}>
                                                <Text style={{ fontSize: 15, color: '#FFFFFF', fontFamily: 'Poppins-SemiBold' }}>Add New</Text>
                                            </Pressable>
                                        )
                                    }

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ width: '10%', marginBottom: 5 }}>
                                        {
                                            this.state.width < 769 ? (<TouchableOpacity
                                                onPress={() => this.requestCameraPermission()}
                                            ><Image
                                                    source={require('../Assets/qr-codeAsset2-8.png')}
                                                    style={{ width: 30, height: 30, }}
                                                /></TouchableOpacity>) : null
                                        }
                                    </View>
                                    <View style={{ width: this.state.width < 769 ? '65%' : '70%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                                        <ScrollView
                                            horizontal={true}
                                            contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10, flexDirection: "row", justifyContent: 'center', marginBottom: 10, marginTop: this.state.width < 769 ? 0 : 5 }}>
                                            {
                                                this.state.topScroll.map((items) =>
                                                    <View style={{ marginLeft: 10, marginTop: this.state.width < 769 ? 12 : 12, alignItems: 'center' }}>
                                                        <View style={{ paddingTop: this.state.width < 769 ? 0 : -18, zIndex: 9999, position: 'absolute', right: -3, top: -11, alignItems: 'center', backgroundColor: 'white', width: 16, borderRadius: 15, height: 16 }}>
                                                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 10, }}>{items.noOfGroup}</Text>
                                                        </View>
                                                        <Pressable
                                                            onPress={() => this.getAllgsdd(items)}
                                                            style={{ paddingVertical: 1, paddingHorizontal: 9, backgroundColor: items.slideStatus == 1 ? '#067655' : items.slideStatus == 3 ? "#B10808" : items.slideStatus == 2 ? "#DE9114" : null, borderRadius: 5, width: "auto", height: 28 }}>
                                                            <Text style={{ fontSize: 16, color: '#ffffff', fontFamily: 'Poppins-SemiBold' }}>{items.groupSize}</Text>
                                                        </Pressable>
                                                    </View>
                                                )
                                            }

                                        </ScrollView>
                                    </View>
                                    <View style={{ width: this.state.width < 769 ? '11%' : "10%", alignItems: 'flex-end', marginBottom: 5 }}>
                                        {
                                            this.state.width < 769 ? (
                                                <Pressable
                                                    onPress={() => {
                                                        this.setState({ searchShow: false })
                                                        this.setState({ waitList: [], loader: true })
                                                        setTimeout(() => {
                                                            this.getListss()
                                                            this.setState({ loader: false })
                                                        }, 500)
                                                    }}
                                                    style={{ paddingVertical: 8, paddingHorizontal: 9, backgroundColor: '#ffffff', borderRadius: 5, height: 28, marginTop: 2, }}>
                                                    <Image
                                                        source={require('../Assets/open-reload.png')}
                                                        style={{ width: 15, height: 15, }}
                                                    />
                                                    {/* <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>Clear</Text> */}
                                                </Pressable>
                                            ) : (<Pressable
                                                onPress={() => { this.getAll(), this.getListss() }}
                                                style={{ paddingVertical: 3, paddingHorizontal: 9, backgroundColor: '#ffffff', borderRadius: 5, height: 28, marginTop: 10 }}>
                                                <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>Clear</Text>
                                            </Pressable>)
                                        }

                                    </View>
                                    <View style={{ width: this.state.width < 769 ? '11%' : "8%", alignItems: 'flex-end', marginBottom: this.state.width < 769 ? 5 : 0, marginTop: this.state.width < 769 ? 1 : 5 }}>
                                        {
                                            this.state.width < 769 ? (
                                                <Pressable
                                                    onPress={() => this.setState({ closetime: true })}
                                                    style={{ paddingVertical: 4, paddingHorizontal: 9, backgroundColor: '#ffffff', borderRadius: 5, height: 28, }}>
                                                    <Image
                                                        source={require('../Assets/black-calender.png')}
                                                        style={{ width: 18, height: 18, }}
                                                        resizeMode={"contain"}
                                                    />
                                                </Pressable>
                                            ) : (
                                                <Pressable
                                                    onPress={() => this.setState({ closetime: !this.state.closetime })}
                                                    style={{ paddingVertical: 4, paddingHorizontal: 9, backgroundColor: '#ffffff', borderRadius: 5, height: 30, }}>
                                                    <Image
                                                        source={require('../Assets/black-calender.png')}
                                                        style={{ width: 18, height: 18, }}
                                                        resizeMode={"contain"}
                                                    />
                                                </Pressable>
                                            )
                                        }
                                    </View>
                                </View>
                                {
                                    this.state.width < 769 ? null : (<View style={{ backgroundColor: '#ffffff', height: 59, justifyContent: 'center', alignContent: 'center', borderRadius: 7, width: '100%', flexDirection: 'row', marginBottom: 9 }}>
                                        <Image
                                            source={require('../Assets/ico-search.png')}
                                            style={{ width: 20, height: 20, marginTop: Platform.OS == "ios" ? 20 : 18, }}
                                        />
                                        <TextInput
                                            placeholder='Search'
                                            placeholderTextColor={'#000000'}
                                            value={this.state.search}
                                            selectionColor={'#067655'}
                                            maxLength={20}
                                            onChangeText={(text) => this.searchFilter(text)}
                                            style={{ width: '90%', fontFamily: 'Poppins-Regular', color: '#000000', fontSize: 24, padding: 0, paddingBottom: 0, paddingTop: 3, marginLeft: 10 }}
                                        />
                                        {
                                            this.state.search == "" ? (
                                                <TouchableOpacity
                                                    onPress={() => this.requestCameraPermission()}
                                                    style={{ marginTop: "0.2%" }}
                                                >
                                                    <Image
                                                        source={require('../Assets/ico-qr.png')}
                                                        style={{ width: 30, height: 32, paddingRight: 20, marginTop: Platform.OS == "ios" ? 15 : 10 }}
                                                    />
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ search: "" });
                                                    this.getAll(), this.getListss()
                                                }}>
                                                    <Image
                                                        source={require('../Assets/ico-close.png')}
                                                        style={{ width: 30, height: 30, paddingRight: 20, marginTop: Platform.OS == "ios" ? 15 : 10 }}
                                                    />
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>)
                                }
                            </View>
                            <View style={{ height: this.state.width < 769 ? "92%" : "85%" }}>
                                <ScrollView
                                // contentContainerStyle={{ height: '93%',width:"100%" }}
                                >
                                    <View style={{ paddingVertical: 26, paddingHorizontal: this.state.width < 769 ? 10 : 30, backgroundColor: '#EDEDF4', height: '100%', paddingTop: 13 }}>
                                        {this.state.loader == true ? (<View style={{
                                            flex: 1,
                                            justifyContent: "center"
                                        }}><ActivityIndicator size="large" color="#B10808" /></View>) : null}
                                        {
                                            this.state.timeShow == true ? this.state.waitList.length == 0 ?
                                                (<View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    {/* <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlignVertical: 'center' }}>{this.state.nodataa}</Text> */}
                                                    <Image
                                                        source={require('../Assets/no-data-found.png')}
                                                        style={{ height: 200, width: 200, marginTop: "50%" }}
                                                        resizeMode="contain"
                                                    />
                                                </View>)
                                                : (
                                                    <SwipeListView
                                                        data={this.state.waitList}
                                                        keyExtractor={(item, index) => index}
                                                        renderItem={(data, secId, rowId, rowMap, i) => {
                                                            return (
                                                                <View style={{ flexDirection: 'row', marginTop: 20, borderWidth: data.item.waitlistStatus == true ? 1 : data.item.noOfNotification != 0 && data.item.waitlistStatus == false ? 1 : 0, borderRadius: 10, borderColor: data.item.waitlistStatus == true ? "#B10808" : data.item.waitlistStatus == false ? "#DE9114" : null, borderTopRightRadius: 10, borderBottomRightRadius: 10, width: this.state.width < 769 ? "100%" : "100%" }}>
                                                                    <Pressable
                                                                        onPress={() => this.setMo(data)}
                                                                        style={{ backgroundColor: 'white', paddingHorizontal: this.state.width < 769 ? 8 : 24, paddingVertical: 15, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, width: this.state.width < 769 ? "96%" : "96%" }}>
                                                                        <Pressable
                                                                            onPress={() => this.setMo(data)}
                                                                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                            <Pressable onPress={() => this.setMo(data)} style={{ flexDirection: 'row', justifyContent: 'space-between', width: "60%" }}>
                                                                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                                                    {data.item.byUser != 1 ?
                                                                                        <View>
                                                                                            {
                                                                                                data.item.isComing == false ? null :
                                                                                                    <FastImage style={{ height: 40, width: 40, opacity: 1 }} source={require('../Assets/blinker.gif')} resizeMode="contain" />
                                                                                            }
                                                                                        </View> :
                                                                                        <TouchableOpacity onPress={() => {
                                                                                            AsyncStorage.setItem("businessWaitlistId", data.item.id.toString());
                                                                                            this.props.navigation.navigate("WaitTime")
                                                                                        }}>
                                                                                            <FastImage style={{ height: 40, width: 40, opacity: 1 }} source={require('../Assets/clock-notifier.gif')} resizeMode="contain" />
                                                                                        </TouchableOpacity>
                                                                                    }

                                                                                    <View>
                                                                                        <View style={{ display: "flex", flexDirection: "row-reverse", alignItems: "center" }}>
                                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold' }}>{data.item.customerPhone} {data.item.isReservation == true ? (<Image
                                                                                                source={require('../Assets/noun-reservation-2408719-01.png')}
                                                                                                style={{ width: 20, height: 20, }}
                                                                                            />) : null}</Text>
                                                                                        </View>
                                                                                        <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{data.item.customerName.slice(0, 12) + (data.item.customerName.length > 12 ? ".." : "")}</Text>
                                                                                    </View>
                                                                                </View>
                                                                                <Pressable onPress={() => this.setMo(data)}
                                                                                >
                                                                                    <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'center', fontFamily: 'OpenSans-Bold' }}>#{data.item.tableNoValue}</Text>
                                                                                    <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{this.seatingarea(data)}</Text>
                                                                                </Pressable>
                                                                            </Pressable>
                                                                            <View style={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                                                {
                                                                                    data.item.byUser != 1 ?
                                                                                        <View>
                                                                                            {
                                                                                                data.item.isReservation != true ? (<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                                                    <Text style={{ color: data.item.timeExceed == true ? "#B10808" : "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{this.counterTime(data)}</Text>
                                                                                                    <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>/{data.item.waitTime} <Text style={{ color: "#000000", fontSize: 18, textAlign: 'right', fontFamily: 'OpenSans-Regular' }}>mins</Text></Text>
                                                                                                </View>) : (<Text style={{ color: "black", fontSize: this.state.width < 769 ? 18 : 24, textAlign: 'right', fontFamily: 'OpenSans-Bold' }}>{new Date(data.item.reservation).toLocaleDateString("en-GB")}</Text>)
                                                                                            }
                                                                                        </View> : <View></View>
                                                                                }
                                                                                <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: 'right' }}> Arrived at {this.ArriveTime(data)}</Text>
                                                                            </View>
                                                                        </Pressable>
                                                                        {/* <View style={{flexDirection:"row"  }}>
                                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', opacity: 0.7, fontFamily: 'OpenSans-Regular', }}>Preferred Area: </Text>
                                                        <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold',  }}></Text>
                                                    </View> */}
                                                                        <Pressable
                                                                            onPress={() => this.setMo(data)}
                                                                            style={{ borderWidth: 0.5, alignSelf: "center", width: "100%", borderColor: "#707070", marginTop: 10, opacity: 0.2 }}></Pressable>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 9, alignItems: "flex-end" }}>
                                                                            <Pressable
                                                                                onPress={() => this.setMo(data)}
                                                                                style={{ flexDirection: this.state.width < 769 ? 'column' : 'row', width: "30%" }}>
                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{data.item.notes != "" ? "Notes:" : null}</Text>
                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold' }}>{data.item.notes != "" ? data.item.notes.slice(0, 13) + (data.item.notes.length > 13 ? ".." : "") : null}</Text>
                                                                            </Pressable>
                                                                            <View style={{ flexDirection: this.state.width < 769 ? 'column' : 'row' }}>
                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: 'right' }}>Total Members: </Text>
                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold', textAlign: 'right' }}>{data.item.groupSize} (<Text style={{ fontSize: this.state.width < 769 ? 12 : 16, color: '#000000', fontFamily: 'OpenSans-SemiBold', textAlign: 'right' }}>{data.item.adults != 0 ? data.item.adults + " Adults" : null}{data.item.children != 0 ? (data.item.adults != 0 ? "," : "") + data.item.children + " Kids" : null}{data.item.divyang != 0 ? ((data.item.adults != 0 || data.item.children != 0) ? "," : "") + data.item.divyang + " Disable" : null}</Text>)</Text>
                                                                            </View>
                                                                        </View>
                                                                    </Pressable>
                                                                    <Pressable
                                                                        onPress={(data) => this.clickOpen(data)}
                                                                        style={{ backgroundColor: data.item.waitlistStatus == true ? "#B10808" : data.item.noOfNotification != 0 && data.item.waitlistStatus == false ? "#DE9114" : '#067655', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', borderTopRightRadius: 10, width: '4%', paddingLeft: this.state.width < 769 ? 2 : 5 }}>
                                                                        <Image
                                                                            source={require('../Assets/Pathhomearrow.png')}
                                                                            style={{ transform: [{ rotate: data.item.selected ? "0deg" : '180deg' }], width: 8, height: 13 }}
                                                                        />
                                                                    </Pressable>
                                                                </View>
                                                            )
                                                        }}
                                                        renderHiddenItem={(data, rowMap, rowId) => (
                                                            <View
                                                                style={{ marginTop: 20, backgroundColor: data.item.waitlistStatus == true ? "#B10808" : data.item.noOfNotification != 0 && data.item.waitlistStatus == false ? "#DE9114" : '#067655', height: this.state.width < 769 ? data.item.waitlistStatus == true ? Platform.OS == "ios" ? 126.5 : 123.9 : data.item.noOfNotification != 0 && data.item.waitlistStatus == false ? Platform.OS == "ios" ? 125.9 : 124.5 : Platform.OS == "ios" ? 123.9 : 122 : data.item.waitlistStatus == true ? Platform.OS == "ios" ? 130 : 140 : data.item.noOfNotification != 0 && data.item.waitlistStatus == false ? Platform.OS == "ios" ? 128.5 : 140 : Platform.OS == "ios" ? 126.7 : 138, width: this.state.width < 769 ? "95.8%" : '98.5%', marginLeft: 10, borderTopRightRadius: 10, borderRightWidth: 1, borderBottomRightRadius: 10, borderRightColor: data.item.waitlistStatus == true ? "#B10808" : data.item.noOfNotification != 0 && data.item.waitlistStatus == false ? "#DE9114" : '#067655', }}>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 20, height: '55%', alignItems: 'flex-start', paddingTop: 35 }}>
                                                                    <Pressable
                                                                        onPress={() => this.setState({ modaladdcan: true, swipeId: data.item.id })}
                                                                        style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 55 }}>
                                                                        <Image
                                                                            source={require('../Assets/ico-cancel.png')}
                                                                            style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                                        />
                                                                        <Text style={{ color: 'white', fontSize: this.state.width < 769 ? 12 : 16, marginTop: 13, fontFamily: 'OpenSans-SemiBold' }}>Cancel</Text>
                                                                    </Pressable>
                                                                    <Pressable
                                                                        onPress={() => this.Notification(data, rowId, rowMap)}
                                                                        style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                                                                        <Image
                                                                            source={require('../Assets/ico-notify-01.png')}
                                                                            style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                                        />
                                                                        <Text style={{ color: 'white', fontSize: this.state.width < 769 ? 12 : 16, marginTop: 13, fontFamily: 'OpenSans-SemiBold' }}>Notify</Text>
                                                                    </Pressable>

                                                                    <Pressable
                                                                        onPress={() => this.getCom(data)}
                                                                        style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                                                        <Image
                                                                            source={require('../Assets/ico-checkOff.png')}
                                                                            style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                                        />
                                                                        <Text style={{ color: 'white', fontSize: this.state.width < 769 ? 12 : 16, marginTop: 13, fontFamily: 'OpenSans-SemiBold' }}>Check Off</Text>
                                                                    </Pressable>
                                                                </View>
                                                                {
                                                                    data.item.noOfNotification != 0 ?
                                                                        (<View style={{ borderTopColor: 'white', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 20, height: '30%', alignItems: 'flex-start', paddingTop: 5, marginTop: 20 }}>
                                                                            <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, fontFamily: 'OpenSans-Regular', color: 'white' }}>Notified:- <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, fontFamily: 'OpenSans-Regular', color: 'white' }}>{data.item.noOfNotification != 0 ? data.item.noOfNotification : null}- {data.item.noOfNotification != 0 ? this.notifs(data) : null}m ago {data.item.noOfNotification != 0 ? this.lastTime(data) : null}</Text></Text>
                                                                        </View>) : null
                                                                }
                                                            </View>
                                                        )}
                                                        leftOpenValue={0}
                                                        rightOpenValue={this.state.width < 769 ? -210 : -280}
                                                        onRowOpen={(keyIndex, rowId, rowMap) => this.insertTag(keyIndex, rowId)}
                                                        onRowClose={(keyIndex, rowId, rowMap) => this.closeTag(keyIndex, rowId)}
                                                        disableRightSwipe={true}
                                                    // closeOnRowOpen={false}
                                                    />
                                                ) : (
                                                <View>
                                                    <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15 }}>
                                                        <FastImage style={{ height: 129, opacity: 1 }} source={require('../Assets/skeleton-2.gif')} />
                                                        {/* <Image
                                            source={require('../Assets/amalie-steiness.gif')}
                                            style={{ width: 100, height: 100 }}
                                        /> */}
                                                    </View>
                                                    <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15, }}>
                                                        <FastImage style={{ height: 129, opacity: 1 }} source={require('../Assets/skeleton-2.gif')} />
                                                        {/* <Image
                                            source={require('../Assets/amalie-steiness.gif')}
                                            style={{ width: 100, height: 100 }}
                                        /> */}
                                                    </View>
                                                    <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15 }}>
                                                        <FastImage style={{ height: 129, opacity: 1 }} source={require('../Assets/skeleton-2.gif')} />
                                                        {/* <Image
                                            source={require('../Assets/amalie-steiness.gif')}
                                            style={{ width: 100, height: 100 }}
                                        /> */}
                                                    </View>
                                                    <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15 }}>
                                                        <FastImage style={{ height: 129, opacity: 1 }} source={require('../Assets/skeleton-2.gif')} />
                                                        {/* <Image
                                            source={require('../Assets/amalie-steiness.gif')}
                                            style={{ width: 100, height: 100 }}
                                        /> */}
                                                    </View>
                                                    {/* <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15, opacity: 0.6 }} />
                                    <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15, opacity: 0.4 }} />
                                    <View style={{ backgroundColor: "white", width: '100%', borderRadius: 5, height: 129, marginTop: 15, opacity: 0.3 }} /> */}
                                                </View>
                                            )
                                        }
                                        <View style={{ height: 140 }}>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                            {
                                this.state.width < 769 ? (<Pressable
                                    onPress={() => this.props.navigation.navigate("Addnew")}
                                    style={{
                                        marginTop: 15,
                                        position: 'absolute',
                                        bottom: 90,
                                        right: 30,
                                    }}
                                >
                                    <Image
                                        source={require('../Assets/Group42.png')}
                                        style={{ width: 50, height: 50 }}
                                    />
                                </Pressable>) : null
                            }
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
                                    marginBottom: Platform.OS == "ios" ? 20 : 0,

                                }}>
                                    <Pressable
                                        onPress={() => this.setState({ openModel: false })}
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
                                        borderRadius: 15,
                                        backgroundColor: "white",
                                        width: this.state.width < 769 ? '100%' : '100%', height: 500,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 9,
                                        },
                                        shadowOpacity: 0.50,
                                        shadowRadius: 12.35,

                                        elevation: 19,
                                    }}>
                                        <ScrollView>
                                            <View style={{ paddingBottom: 20, padding: 20, }}>
                                                {
                                                    this.state.waitList.map((result, i) => {
                                                        if (result.id == this.state.swipeId) {
                                                            return (
                                                                <View>
                                                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                        <View>
                                                                            {/* <FastImage style={{ height: 15, width: 15, opacity: 1 }} source={require('../Assets/blinker.gif')} /> */}
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold' }}>{result.customerPhone} {result.isReservation == true ? (<Image
                                                                                source={require('../Assets/noun-reservation-2408719-01.png')}
                                                                                style={{ width: 20, height: 20, }}
                                                                            />) : null}</Text>
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular' }}>{result.customerName}</Text>
                                                                        </View>
                                                                        <View >
                                                                            {
                                                                                result.isReservation != true ? (<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                                    <Text style={{ color: result.timeExceed == true ? "red" : "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlign: "right" }}>{this.counterTimeModel(result)}</Text>
                                                                                    <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlign: "right" }}>/{result.waitTime} <Text style={{ color: "#000000", fontSize: 18, fontFamily: 'OpenSans-Regular', textAlign: "right" }}>mins</Text></Text>
                                                                                </View>) : (<Text style={{ color: "black", fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'OpenSans-Bold', textAlign: "right" }}>{new Date(result.reservation).toLocaleDateString("en-GB")}</Text>)
                                                                            }
                                                                            <Text style={{ color: "#000000", fontSize: this.state.width < 769 ? 12 : 16, opacity: 0.7, fontFamily: 'OpenSans-Regular', textAlign: "right" }}> Arrived at {this.ArriveTimeModel(result)}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ marginTop: 10 }}>
                                                                        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                            <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Total Guest:- {result.groupSize}</Text>
                                                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', marginTop: 13, }}>
                                                                            <View>
                                                                                {
                                                                                    result.adults != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 24, borderRadius: 15, }}>
                                                                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{result.adults}</Text>
                                                                                    </View>) : null
                                                                                }
                                                                                <Pressable
                                                                                // onPress={() => this.adultguest()}
                                                                                >
                                                                                    {
                                                                                        result.adults != 0 ? (<Image
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
                                                                                    result.children != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 24, borderRadius: 15, }}>
                                                                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{result.children}</Text>
                                                                                    </View>) : null
                                                                                }
                                                                                <Pressable
                                                                                // onPress={() => this.kidsguest()}
                                                                                >

                                                                                    {
                                                                                        result.children != 0 ? (<Image
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
                                                                                    result.divyang != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 24, borderRadius: 15, }}>
                                                                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{result.divyang}</Text>
                                                                                    </View>) : null
                                                                                }

                                                                                <Pressable
                                                                                // onPress={() => this.disableguest()}
                                                                                >
                                                                                    {
                                                                                        result.divyang != 0 ? (<Image
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
                                                                        result.businessWaitlistSeatings.length != 0 ?
                                                                            <View style={{ marginTop: 10 }}>
                                                                                <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                    <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Preferred Area</Text>
                                                                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                                                    {
                                                                                        result.businessWaitlistSeatings.map((item, i) =>
                                                                                            <Pressable
                                                                                                // onPress={() => this.prefArea(i, item)}
                                                                                                style={{ backgroundColor: "#067655", borderWidth: 2, borderColor: "#067655", borderRadius: 66, height: 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10, paddingVertical: 0, paddingVertical: 0, paddingHorizontal: this.state.width < 769 ? 12 : 15, paddingBottom: 4 }}>
                                                                                                <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, fontFamily: 'OpenSans-Regular', color: "#FFFFFF" }}>{item.seatingArea}</Text>
                                                                                            </Pressable>
                                                                                        )
                                                                                    }
                                                                                </View>
                                                                            </View> : null
                                                                    }

                                                                    {
                                                                        result.tableNoValue != "" ? (<View style={{ marginTop: 10 }}>
                                                                            <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Table No.</Text>
                                                                                <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                            </View>
                                                                            <TextInput
                                                                                placeholder='Notes'
                                                                                placeholderTextColor={'#000000'}
                                                                                value={result.tableNoValue}
                                                                                editable={false}
                                                                                selectionColor={'#067655'}
                                                                                style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 0 : 0, height: 40 }}
                                                                            />
                                                                        </View>) : null
                                                                    }
                                                                    {
                                                                        result.notes != "" ? (<View style={{ marginTop: 10 }}>
                                                                            <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Notes</Text>
                                                                                <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                            </View>
                                                                            <TextInput
                                                                                placeholder='Notes'
                                                                                placeholderTextColor={'#000000'}
                                                                                value={result.notes}
                                                                                editable={false}
                                                                                multiline={true}
                                                                                selectionColor={'#067655'}
                                                                                style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 0 : 0, height: 40 }}
                                                                            />
                                                                        </View>) : null
                                                                    }
                                                                    {
                                                                        result.businessWaitlistOthers.length == 0 ? null :
                                                                            (
                                                                                <View style={{ marginTop: 10 }}>
                                                                                    <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                                                        <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}> Custom Fields</Text>
                                                                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                                                                    </View>
                                                                                    {
                                                                                        result.businessWaitlistOthers.map((li) => {
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

                                                                                </View>)
                                                                    }
                                                                </View>
                                                            )
                                                        }
                                                    })
                                                }

                                            </View>
                                        </ScrollView>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 23, }}>
                                            <Pressable
                                                onPress={() => this.setState({ modaladdcan: true, openModel: false })}
                                                style={{ backgroundColor: '#B10808', paddingVertical: 10, paddingHorizontal: 10, width: "35%", height: Platform.OS == "ios" ? 70 : "auto", marginBottom: Platform.OS == "ios" ? -25 : 0, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={require('../Assets/ico-cancel.png')}
                                                    style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                />
                                                <Text style={{ fontSize: this.state.width < 769 ? 15 : 20, color: '#ffff', fontFamily: 'Poppins-SemiBold', marginLeft: 10 }}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.NotificationModal()}
                                                style={{ backgroundColor: 'orange', paddingVertical: 10, paddingHorizontal: 10, width: "30%", height: Platform.OS == "ios" ? 70 : "auto", marginBottom: Platform.OS == "ios" ? -25 : 0, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={require('../Assets/ico-notify-01.png')}
                                                    style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                />
                                                <Text style={{ fontSize: this.state.width < 769 ? 15 : 20, color: '#ffff', fontFamily: 'Poppins-SemiBold', marginLeft: 10 }}> Notify</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.modgetCom()}
                                                style={{ backgroundColor: '#067655', paddingVertical: 10, paddingHorizontal: 10, width: "35%", height: Platform.OS == "ios" ? 70 : "auto", marginBottom: Platform.OS == "ios" ? -25 : 0, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={require('../Assets/ico-checkOff.png')}
                                                    style={{ width: this.state.width < 769 ? 24 : 38, height: this.state.width < 769 ? 21 : 35, }}
                                                />
                                                <Text style={{ fontSize: this.state.width < 769 ? 15 : 20, color: '#ffff', fontFamily: 'Poppins-SemiBold', marginLeft: 10 }}>
                                                    Check Off</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
                            <DateTimePickerModal
                                testID="dateTimePicker"
                                value={this.state.endTime}
                                isVisible={this.state.closetime}
                                mode="date"
                                is24Hour={true}
                                display="spinner"
                                minimumDate={new Date()}
                                onConfirm={async (date) => {
                                    let time = new Date()
                                    time.setHours(time.getHours() + 5)
                                    time = new Date(time)
                                    time.setMinutes(time.getMinutes() + 30)
                                    time = new Date(time).toJSON()
                                    this.setState({ cureTime: time })
                                    let ss = await AsyncStorage.getItem("businessId")
                                    let token = await AsyncStorage.getItem("jwtoken")
                                    let buseinssId = ss
                                    let dateforApi = new Date(date).getFullYear() + "-" + (new Date(date).getMonth() + 1) + "-" + new Date(date).getDate()
                                    this.setState({ endTime: new Date(date) })
                                    await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlist?businessId=" + buseinssId + "&waitListDate=" + dateforApi + "&currentDataTime=" + this.state.cureTime, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            // 'Content-Type': 'application/json-patch+json'
                                        }
                                    }).then((re) => {

                                        this.setState({ topScroll: re.data.data.waitListSliders })
                                        if (re.data.data.businessWaitlistResponses.length == 0) {
                                            this.setState({ nodataa: "No Wait List Avaliable" })
                                        } else {
                                            this.setState({ nodataa: "" })
                                        }
                                        const newArray = re.data.data.businessWaitlistResponses.map(e => {
                                            return {
                                                ...e,
                                                selected: false
                                            }
                                        })
                                        this.setState({
                                            waitList: newArray
                                        })

                                        this.setState({ getfilterValue: newArray, closetime: false })
                                    })



                                }}
                                onCancel={() => this.setState({ closetime: false })}
                            />
                        </View> :
                        <View>
                            <InternetCheck />
                        </View>
                }
            </View>
        )
    }
}