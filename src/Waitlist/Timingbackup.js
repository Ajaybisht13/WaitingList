import { Text, View, Pressable, Image, Dimensions, Modal, Platform } from 'react-native'
import React, { Component } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'react-native-check-box'
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { basesUrl } from '../../App';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class Timing extends Component {

    constructor() {
        super();
        this.state = {
            width: 0,
            day: [
                {
                    "id": 1,
                    "day": "SUN",
                    "Select": false
                },
                {
                    "id": 2,
                    "day": "MON",
                    "Select": false
                },
                {
                    "id": 3,
                    "day": "TUE",
                    "Select": false
                },
                {
                    "id": 4,
                    "day": "WED",
                    "Select": false
                },
                {
                    "id": 5,
                    "day": "THU",
                    "Select": false
                },
                {
                    "id": 6,
                    "day": "FRI",
                    "Select": false
                },
                {
                    "id": 7,
                    "day": "SAT",
                    "Select": false
                }
            ],
            day1: [
                {
                    "id": 1,
                    "day": "SUN",
                    "Select": false
                },
                {
                    "id": 2,
                    "day": "MON",
                    "Select": false
                },
                {
                    "id": 3,
                    "day": "TUE",
                    "Select": false
                },
                {
                    "id": 4,
                    "day": "WED",
                    "Select": false
                },
                {
                    "id": 5,
                    "day": "THU",
                    "Select": false
                },
                {
                    "id": 6,
                    "day": "FRI",
                    "Select": false
                },
                {
                    "id": 7,
                    "day": "SAT",
                    "Select": false
                }
            ],
            allDay: false,
            closetime: false,
            gettime: new Date(),
            checkon: false,
            modaladd: false,
            showsaveDays: false,
            showtruevalue: [],
            openTme: "",
            startTime: false,
            endTime: "",
            showTimelist: [],
            disableValue: false,
            busId: 0,
            openSendtime: "",
            closeSendtime: "",
            showTimelist: [],
            adTimingid: 0,
            days: [],
            loc: false,
            showerror: "",
            timematch: [],
            daytimeset: null,
            deletemod: false,
            deleteId: 0,
            saveconfi: false,
            finalChek: false,
            savedayConf: false
        }
    }

    componentDidMount = async () => {
        let deviceWidth = Dimensions.get("screen").width
        this.setState({ width: deviceWidth })
        let ss = await AsyncStorage.getItem("businessId")
        this.setState({ busId: ss })
        this.getDays()
        this.getTimelist()
        // console.log(new Date().toJSON(), "time");

    }

    getDays = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        let ss = await AsyncStorage.getItem("businessId")
        axios.get(basesUrl + "v1/BusinessWaitlist/GetDaysByBusinessId?businessId=" + ss, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json-patch+json'
            }
        }).then((response) => {
            // console.log(response.data.data)
            this.setState({ day: response.data.data, day1: response.data.data })
            const newArray = response.data.data.map(e => {
                return {
                    ...e,
                    atSelection: false
                }
            })
            this.setState({ day1: newArray, days: newArray })
        })
    }
    getTimelist = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        let ss = await AsyncStorage.getItem("businessId")
        axios.get(basesUrl + "v1/BusinessWaitlist/GetTimingByBusinessId?businessId=" + ss, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json-patch+json'
            }
        }).then((response) => {
            // console.log(response.data.data)
            this.setState({ showTimelist: response.data.data, timematch: response.data.data })
            // this.checktime()
        })
    }


    selectDays = (itme) => {
        // console.log(itme.id);

        let selectDay = this.state.day.map((re) => {
            if (itme.id == re.id) {
                re.isActive = !re.isActive
            }
            return { ...re }
        })
        this.setState({ day: selectDay, allDay: false })
    }

    checkValueTrue = () => {
        let obj = this.state.day.find(o => o.isActive === true);
        console.log(obj, "check function call");
        if (obj != undefined) {
            this.setState({ showsaveDays: true })
        } else {
            this.setState({ showsaveDays: true })
        }

    }

    getAlltruevalue = async () => {
        let trueValue = []
        this.state.day.map((item) => {
            let selectday = {
                "id": item.id,
                "day": item.day,
                "isActive": item.isActive,
                "daysMasterId": item.daysMasterId
            }
            trueValue.push(selectday)

            return { ...item }
        })
        let token = await AsyncStorage.getItem("jwtoken")
        let ss = await AsyncStorage.getItem("businessId")
        let postDaa = {
            "businessesId": this.state.busId,
            "businessDays": trueValue,
        }
        // console.log(postDaa, "final");
        await axios.post(basesUrl + "v1/BusinessWaitlist/UpdateBusinessDays", postDaa, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json-patch+json'
            }
        }).then((result) => {
            // console.log(result.data)
            this.getDays();
            this.setState({ showsaveDays: false, savedayConf: false })
        })
        // this.setState({ showtruevalue: trueValue, showsaveDays: false, disableValue: true }, () => console.log(this.state.showtruevalue, "pl"))
    }

    selectmodalDate = (itme) => {
        // console.log(itme, "sd");
        if (itme.isActive == true) {
            let dty = this.state.day1.map((re) => {
                if (itme.id == re.id) {
                    re.atSelection = !re.atSelection;
                }
                return { ...re }
            })
            this.setState({ day1: dty })
        }
    }

    addBusinessTime = async () => {
        let busday = []
        this.state.day1.map((item) => {
            if (item.atSelection == true) {
                busday.push(item.id)
            }
        })
        // console.log(busday, "selectedid");

        if (busday.length != 0) {
            if (this.state.checkon == true) {
                let businessDaysIds = []
                this.state.day1.map((item) => {
                    if (item.atSelection == true) {
                        businessDaysIds.push(item.id)
                    }
                })
                let checker = false
                businessDaysIds.map((item) => {
                    // console.log("checklee", this.state.timematch.length);
                    if (this.state.timematch.length != 0) {
                        for (let i = 0; i < this.state.timematch.length; i++) {
                            this.state.timematch[i].businessDaysId.map((re) => {
                                if (re == item && this.state.adTimingid != this.state.timematch[i].id) {
                                    // console.log("okFine opentime");
                                    if (new Date(this.state.timematch[i].openTime) == 0 && new Date(this.state.timematch[i].endTime) == 24) {
                                        checker = true
                                        // console.log("ok");
                                    }
                                    if (new Date(this.state.timematch[i].openTime) && new Date(this.state.timematch[i].endTime)) {
                                        checker = true
                                        this.setState({ loc: true, showerror: "You have already set these timing", modaladd: false })
                                    }

                                    // console.log("000000");
                                    // console.log("okFine opentime");
                                    // this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "setopenalert"))
                                    // this.setState({ loc: true, showerror: "You have already set these timing" })
                                    // checker = true
                                } else {
                                    this.setState({ daytimeset: false }, () => console.log(this.state.daytimeset, "setopenalert"))
                                    // this.setState({ loc: true, showerror: "You have already set these timing" })
                                }
                            })
                        }
                    } else if (this.state.timematch.length == 0) {
                        // console.log("notimimg");
                        this.setState({ daytimeset: false })
                    }
                })

                // console.log(checker, "ppllllp");
                if (checker == false) {
                    // console.log(businessDaysIds, "selectedid");
                    let Data = {
                        "id": this.state.adTimingid,
                        "businessesId": this.state.busId,
                        "openTime": "2023-01-04T00:00:00.871Z",
                        "endTime": "2023-01-04T23:59:11.871Z",
                        "businessDaysId": businessDaysIds
                    }
                    let token = await AsyncStorage.getItem("jwtoken")
                    axios.post(basesUrl + "v1/BusinessWaitlist/AddEditBusinessTiming", Data, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            // 'Content-Type': 'application/json-patch+json'
                        }
                    }).then((res) => {
                        // console.log(res.data);
                        this.setState({ modaladd: false, checkon: false, finalChek: false })
                        this.getDays()
                        this.getTimelist()
                        this.setState({ adTimingid: 0, checkon: false, openSendtime: "", closeSendtime: "", openTme: "", endTime: "" })
                        let select = this.state.day1.map((it) => {
                            if (it.atSelection == true) {
                                it.atSelection = false
                            }
                            return { ...it }
                        })
                        // console.log(select, "ol");
                        this.setState({ day1: select })
                    })

                } else {
                    // this.setState({ loc: true, showerror: "You have already set these timing" })
                    console.log("check please");
                }
            } else {
                let businessDaysIds = []
                this.state.day1.map((item) => {
                    if (item.atSelection == true) {
                        businessDaysIds.push(item.id)
                    }
                })
                if (this.state.openSendtime == "" && this.state.closeSendtime == "") {
                    this.setState({ loc: true, showerror: "Please Check Time" })

                } else {
                    let sendOpen = new Date();
                    let sendClose = new Date();
                    if (this.state.openSendtime == "") {
                        let openTime = new Date();
                        openTime.setHours(openTime.getHours() + 5)
                        openTime = new Date(openTime)
                        openTime.setMinutes(openTime.getMinutes() + 30)
                        sendOpen = new Date(openTime)
                        this.setState({ openSendtime: new Date(openTime).toJSON() })
                    } else {
                        let openTime = new Date(this.state.openSendtime);
                        console.log("ookkko", openTime);
                        openTime.setHours(openTime.getHours() + 5)
                        openTime = new Date(openTime)
                        openTime.setMinutes(openTime.getMinutes() + 30)
                        sendOpen = new Date(openTime)
                        console.log(new Date(openTime), "0000");
                        this.setState({ openSendtime: new Date(openTime) })
                    }
                    if (this.state.closeSendtime == "") {
                        let closetime = new Date();
                        closetime.setHours(closetime.getHours() + 5)
                        closetime = new Date(closetime)
                        closetime.setMinutes(closetime.getMinutes() + 30)
                        sendClose = new Date(closetime)
                        this.setState({ closeSendtime: new Date(closetime).toJSON() }, () => console.log(this.state.closeSendtime, "plllllllddhssjdhjdbjkjdkhiudhjdj"))
                    } else {
                        let closetime = new Date(this.state.closeSendtime);
                        closetime.setHours(closetime.getHours() + 5)
                        closetime = new Date(closetime)
                        closetime.setMinutes(closetime.getMinutes() + 30)
                        sendClose = new Date(closetime)
                        console.log(new Date(closetime), "assd");
                        this.setState({ closeSendtime: new Date(closetime) })
                    }
                    console.log(new Date(sendOpen), "x", new Date(sendClose));
                    console.log(this.state.closeSendtime, "pl", this.state.openSendtime);
                    console.log(sendOpen, sendClose, businessDaysIds, "pl");
                    let opentt = new Date(sendOpen);
                    opentt.setHours(opentt.getHours() - 5)
                    opentt = new Date(opentt)
                    opentt.setMinutes(opentt.getMinutes() - 30)
                    let closett = new Date(sendClose);
                    closett.setHours(closett.getHours() - 5)
                    closett = new Date(closett)
                    closett.setMinutes(closett.getMinutes() - 30)
                    let checkval = false
                    businessDaysIds.map((item) => {
                        console.log(this.state.adTimingid, "before adtiming", item, "checklee", this.state.timematch.length);
                        if (this.state.timematch.length != 0) {
                            for (let i = 0; i < this.state.timematch.length; i++) {
                                this.state.timematch[i].businessDaysId.map((re) => {
                                    console.log(this.state.adTimingid, this.state.timematch[i].id, "check condition is correct");
                                    console.log(re, item, "olllll");
                                    if (re == item && this.state.adTimingid != this.state.timematch[i].id) {
                                        console.log("condition execute", this.state.timematch[i]);
                                        console.log(i, "index", re, "select days id", this.state.timematch[i], "lp", new Date(sendOpen));
                                        console.log(new Date(this.state.timematch[i].openTime).getHours())
                                        if (new Date(closett).getHours() >= new Date(this.state.timematch[i].openTime).getHours() && new Date(closett).getHours() <= new Date(this.state.timematch[i].endTime).getHours()) {
                                            this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "check opening time first condition "))
                                            // this.setState({ loc: true, showerror: "You have already set these timing" })
                                            checkval = true
                                        } else if (new Date(opentt).getHours() >= new Date(this.state.timematch[i].endTime).getHours() && new Date(opentt).getHours() <= new Date(this.state.timematch[i].openTime).getHours()) {
                                            this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "check closing time second condition"))
                                            // this.setState({ loc: true, showerror: "You have already set these timing" })
                                            checkval = true
                                        }
                                        if (new Date(opentt).getHours() >= new Date(this.state.timematch[i].openTime).getHours() && new Date(this.state.timematch[i].endTime).getHours() >= new Date(opentt).getHours()) {
                                            this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "check opening time thrid condition"))
                                            // this.setState({ loc: true, showerror: "You have already set these timing" })
                                            checkval = true
                                        } else if (new Date(closett) >= new Date(this.state.timematch[i].openTime).getHours() && new Date(this.state.timematch[i].endTime).getHours() >= new Date(closett)) {
                                            this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "check closingtime forth condition"))
                                            // this.setState({ loc: true, showerror: "You have already set these timing"})
                                            checkval = true
                                        }
                                        if (new Date(opentt).getHours() > new Date(this.state.timematch[i].openTime).getHours() || new Date(opentt).getHours() > new Date(this.state.timematch[i].endTime).getHours()) {
                                            console.log("senddto");
                                            console.log("notimimg");
                                            this.setState({ daytimeset: false })
                                            if (new Date(this.state.timematch[i].openTime).getHours() == 0 && new Date(this.state.timematch[i].endTime).getHours() == 23) {
                                                console.log("55555555");
                                                console.log("okFine opentime");
                                                if (new Date(opentt).getHours() != 0 && new Date(closett).getHours() != 23) {
                                                    console.log("pll85");
                                                } else {
                                                    this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "setopenalert"))
                                                    this.setState({ loc: true, showerror: "You have already set these timing" })
                                                    checkval = true
                                                }

                                            }
                                        } else if (new Date(closett).getHours() < new Date(this.state.timematch[i].openTime).getHours() || new Date(closett).getHours() < new Date(this.state.timematch[i].endTime).getHours()) {
                                            console.log("plpslplpsl");
                                            console.log("notimimg");
                                            this.setState({ daytimeset: false })
                                        } else {
                                            console.log("000000");
                                            console.log("okFine opentime");
                                            this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "setopenalert"))
                                            this.setState({ loc: true, showerror: "You have already set these timing" })
                                            checkval = true
                                        }
                                    }
                                    else {
                                        console.log("when this condition re == item && this.state.adTimingid != this.state.timematch[i].id not work");
                                        // this.setState({ daytimeset: false })
                                        // checkval = false
                                    }
                                })
                            }
                        } else {
                            console.log("when this.state.timematch.length == 0");
                            this.setState({ daytimeset: false })
                            // checkval = true
                        }
                    })

                    console.log(new Date(sendOpen) < new Date(sendClose), "checkval", checkval)
                    if (new Date(sendOpen) < new Date(sendClose) && checkval == false) {
                        // this.checktime(sendOpen, sendClose, businessDaysIds)


                        let Data = {
                            "id": this.state.adTimingid,
                            "businessesId": this.state.busId,
                            "openTime": new Date(sendOpen),
                            "endTime": new Date(sendClose),
                            "businessDaysId": businessDaysIds
                        }
                        let token = await AsyncStorage.getItem("jwtoken")
                        axios.post(basesUrl + "v1/BusinessWaitlist/AddEditBusinessTiming", Data, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                // 'Content-Type': 'application/json-patch+json'
                            }
                        }).then((res) => {
                            console.log(res.data);
                            this.setState({ modaladd: false, checkon: false, daytimeset: null, finalChek: false })
                            this.getDays()
                            this.getTimelist()
                            this.setState({ adTimingid: 0, checkon: false, openSendtime: "", closeSendtime: "", openTme: "", endTime: "" })
                            let select = this.state.day1.map((it) => {
                                if (it.atSelection == true) {
                                    it.atSelection = false
                                }
                                return { ...it }
                            })
                            console.log(select, "ol");
                            this.setState({ day1: select })
                        })


                    } else {
                        let valsd = new Date(sendOpen) < new Date(sendClose)
                        if (valsd == false) {
                            this.setState({ loc: true, showerror: "Opening time is greater then is closing time", modaladd: false })
                        } else {
                            this.setState({ loc: true, showerror: "You have already set these timing"})
                        }

                        //     console.log(this.state.closeSendtime, "pl", this.state.openSendtime);
                        // if (this.state.daytimeset == true) {
                        //     this.setState({ loc: true, showerror: "You have already set these timing" })
                        //     console.log("okFine  closetime");
                        // } else {
                        //     this.setState({ loc: true, showerror: "Please Select Correct Time" })
                        //     console.log(this.state.closeSendtime, "pl", this.state.openSendtime);
                        // }
                    }

                }
            }
        } else {
            this.setState({ loc: true, showerror: "Please Select Days",  modaladd: false  })
            console.log("yrr days to select kr");
        }
    }

    deleteF = async () => {
        console.log(this.state.deleteId, "okkkokokkokkk");
        let token = await AsyncStorage.getItem("jwtoken")
        let dd = {
            "businessTimingId": this.state.deleteId
        }
        axios.post(basesUrl + "v1/BusinessWaitlist/DeleteBussinessTiming", dd, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json-patch+json'
            }
        }).then((res) => {
            console.log(res.data);
            this.setState({ deletemod: false, deleteId: 0 })
            this.getDays()
            this.getTimelist()
        })
    }


    updateFun = (item) => {
        this.setState({ adTimingid: item.id })
        let select = this.state.day1.map((it) => {
            item.businessDaysId.map((re) => {
                if (it.id == re) {
                    it.atSelection = true
                }
            })
            return { ...it }
        })
        console.log(select, "ol");
        this.setState({ day1: select })

        console.log(new Date(item.openTime).getHours(), "ok");
        console.log(new Date(item.openTime).getHours(), new Date(item.endTime).getHours(), "pplll");
        if (new Date(item.openTime).getHours() == 0 && new Date(item.endTime).getHours() == 23) {
            this.setState({ checkon: true, modaladd: true })
            this.setState({ openSendtime: item.openTime, closeSendtime: item.endTime, modaladd: true })
            this.setState({ openTme: new Date(item.openTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) })
            this.setState({ endTime: new Date(item.endTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) })
        } else {
            this.setState({ checkon: false, openSendtime: item.openTime, closeSendtime: item.endTime, modaladd: true })
            this.setState({ openTme: new Date(item.openTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) })
            this.setState({ endTime: new Date(item.endTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) })
        }
    }
    checktime = (sendOpen, sendClose, businessDaysIds) => {
        console.log(sendOpen, sendClose, businessDaysIds, "pl");
        let opentt = new Date(sendOpen);
        opentt.setHours(opentt.getHours() - 5)
        opentt = new Date(opentt)
        opentt.setMinutes(opentt.getMinutes() - 30)
        let closett = new Date(sendClose);
        closett.setHours(closett.getHours() - 5)
        closett = new Date(closett)
        closett.setMinutes(closett.getMinutes() - 30)
        businessDaysIds.map((item) => {
            if (this.state.timematchtimematch != 0) {
                for (let i = 0; i < this.state.timematch.length; i++) {
                    this.state.timematch[i].businessDaysId.map((re) => {
                        if (re == item) {
                            console.log(i, "index", re, "poooooo", this.state.timematch[i].openTime, "lp", new Date(sendOpen));
                            console.log(new Date(sendOpen), "plll", new Date(this.state.timematch[i].openTime).getHours());
                            if (new Date(opentt).getHours() > new Date(this.state.timematch[i].openTime).getHours()) {
                                console.log("okFine opentime");
                                this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "setopenalert"))
                                return true
                            } else {
                                console.log("ij");
                                if (new Date(closett).getHours() < new Date(this.state.timematch[i].endTime).getHours()) {
                                    this.setState({ daytimeset: true }, () => console.log(this.state.daytimeset, "setopenalert"))
                                    console.log("okFine  closetime");
                                }
                            }
                        }
                    })
                }
            }
        })

    }

    handleCheckChange() {
        console.log("checkbox");
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.deletemod}
                    onRequestClose={() => {
                        this.setState({ deletemod: false });
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
                                    style={{ width: this.state.width < 769 ? 35 : 38, height: this.state.width < 769 ? 35 : 35, }}
                                />
                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Are you sure to delete this Business Timing ?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                <Pressable
                                    onPress={() => this.deleteF()}
                                    style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                    <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => this.setState({ deletemod: false })}
                                    style={{ backgroundColor: 'black', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}
                                >
                                    <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>No</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{ backgroundColor: '#000000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, paddingTop: Platform.OS == "ios" ? 50 : 15 }}>
                    <Pressable
                        onPress={() => this.props.navigation.navigate("Navbar")}
                    >
                        <Image
                            source={require('../Assets/hamburger.png')}
                            style={{ width: 36, height: 36 }}
                        />
                    </Pressable>
                    <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-Medium' }}>Business Timing</Text>
                    <Pressable
                        onPress={() => this.props.navigation.navigate("Home")}
                        style={{ backgroundColor: '#067655', paddingHorizontal: this.state.width < 769 ? 15 : 16, paddingVertical: 5, borderRadius: 127 }}
                    >
                        <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 14 : 16, fontFamily: 'Poppins-Medium' }}>Basic</Text>
                        {/* <Image
                source={require('../Assets/small-sb-logo.png')}
                style={{ width: 50, height: 51 }}
            /> */}
                    </Pressable>
                </View>
                <View style={{ padding: 10, }}>
                    <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, color: "#000", fontFamily: "Poppins-SemiBold" }}>Business Days</Text>

                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: -10, marginTop: 5 }}>
                            {
                                this.state.day.map((itme) =>
                                    <Pressable
                                        onPress={() => this.selectDays(itme)}
                                        style={{ alignItems: "center", marginTop: 10, marginLeft: 10 }}>
                                        <CheckBox
                                            style={{ flex: 1, padding: 5 }}
                                            // onChange={()=> console.log("lpp")}
                                            // onClick={() => this.handleCheckChange()}
                                            onClick={() => {
                                                console.log("check box")
                                                let select = this.state.day.map((re) => {
                                                    if (re.id == itme.id) {
                                                        re.isActive = !re.isActive
                                                    }
                                                    return { ...re }
                                                })
                                                this.setState({ day: select })
                                                this.checkValueTrue()
                                            }}
                                            isChecked={itme.isActive}
                                            checkBoxColor={"black"}
                                            checkedCheckBoxColor={"#067655"}
                                        />
                                        <Text style={{ marginTop: 10, fontFamily: "Poppins-Medium" }}>{itme.day}</Text>
                                    </Pressable>)
                            }

                        </View>
                        {/* {
                            this.state.showsaveDays == true ? (<Pressable
                                onPress={() => this.getAlltruevalue()}
                                style={{ backgroundColor: '#067655', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25, width: 90, marginTop: 10, alignSelf: 'flex-end' }}>
                                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'Poppins-SemiBold' }}>Save</Text>
                            </Pressable>) : null
                        } */}
                        <Pressable
                            onPress={() => this.setState({ savedayConf: true })}
                            style={{ backgroundColor: '#067655', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25, width: 90, marginTop: 10, alignSelf: 'flex-end' }}>
                            <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'Poppins-SemiBold' }}>Save</Text>
                        </Pressable>
                    </View>
                    <View>
                        <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 18, color: "#000", fontFamily: "Poppins-SemiBold" }}>Add Timings</Text>
                                <Pressable
                                    style={{ marginTop: 0, marginRight: 10 }}
                                    onPress={() => this.setState({ modaladd: true })}
                                >
                                    <Image
                                        source={require('../Assets/Group42.png')}
                                        style={{ width: 36, height: 36 }}
                                    />
                                </Pressable>
                            </View>
                            {
                                this.state.showTimelist.length != 0 ? (<ScrollView>
                                    {
                                        this.state.showTimelist.map((item, i) =>
                                            <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "space-between", marginRight: 15 }}>
                                                <View style={{}}>
                                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                                        <Pressable
                                                            style={{ backgroundColor: "#EDEDF4", padding: 10, width: 85, borderRadius: 10 }}
                                                        // onPress={() => this.setState({ closetime: true })}
                                                        >
                                                            <Text>{new Date(item.openTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })}</Text>
                                                        </Pressable>
                                                        <Text style={{ marginHorizontal: 10 }}>To</Text>
                                                        <Pressable style={{ backgroundColor: "#EDEDF4", padding: 10, width: 85, borderRadius: 10 }}
                                                        // onPress={() => this.setState({ closetime: true })}
                                                        >
                                                            <Text>{new Date(item.endTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })}</Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                                <View style={{ marginLeft: 10, flexDirection: "row" }}>
                                                    <Pressable
                                                        onPress={() => this.updateFun(item)}
                                                    >
                                                        <Image
                                                            source={require('../Assets/editing.png')}
                                                            style={{ width: 25, height: 25 }}
                                                        />
                                                    </Pressable>
                                                    <Pressable style={{ marginLeft: 10 }}
                                                        onPress={() => this.setState({ deleteId: item.id, deletemod: true })}
                                                    >
                                                        <Image
                                                            source={require('../Assets/delete.png')}
                                                            style={{ width: 20, height: 25 }}
                                                        />
                                                    </Pressable>
                                                </View>
                                            </View>
                                        )
                                    }
                                </ScrollView>) : null
                            }

                        </View>
                    </View>
                </View>
                {
                    this.state.startTime == true && Platform.OS == "android" ? (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={this.state.openTme != "" ? new Date(this.state.openSendtime) : this.state.gettime}
                            mode="time"
                            is24Hour={true}
                            display="spinner"

                            onChange={(date) => {
                                let dat = new Date(date.nativeEvent.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })
                                var now = new Date(date.nativeEvent.timestamp); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
                                var isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
                                // console.log(new Date(isoDate).toISOString().slice(0, -5) + "Z", "plhjhhggg", new Date(date.nativeEvent.timestamp).getHours());
                                this.setState({ openTme: dat, startTime: false, openSendtime: new Date(date.nativeEvent.timestamp).toJSON() })
                                // console.log(this.state.openTme, "oktime", this.state.openSendtime);

                            }}
                            onCancel={() => this.setState({ startTime: false })}
                        />) : null
                }
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.saveconfi}
                    onRequestClose={() => {
                        this.setState({ saveconfi: false });
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
                                    style={{ width: this.state.width < 769 ? 35 : 38, height: this.state.width < 769 ? 35 : 35, }}
                                />
                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Are you sure to save this Business Timing ?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                <Pressable
                                    onPress={() => this.setState({ saveconfi: false, finalChek: true })}
                                    style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                    <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => this.setState({ saveconfi: false, finalChek: false })}
                                    style={{ backgroundColor: 'black', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}
                                >
                                    <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>No</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.savedayConf}
                    onRequestClose={() => {
                        this.setState({ savedayConf: false });
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
                                    style={{ width: this.state.width < 769 ? 35 : 38, height: this.state.width < 769 ? 35 : 35, }}
                                />
                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Are you sure to save this Business Days ?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                <Pressable
                                    onPress={() => this.getAlltruevalue()}
                                    style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                    <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => this.setState({ savedayConf: false })}
                                    style={{ backgroundColor: 'black', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}
                                >
                                    <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>No</Text>
                                </Pressable>

                            </View>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.closetime == true && Platform.OS == "android" ? (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={this.state.endTime != "" ? new Date(this.state.closeSendtime) : this.state.gettime}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={(date) => {
                                let dat = new Date(date.nativeEvent.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })
                                var now = new Date(date.nativeEvent.timestamp); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
                                var isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
                                this.setState({ endTime: dat, closetime: false, closeSendtime: new Date(date.nativeEvent.timestamp).toJSON() })
                                // console.log(this.state.endTime, "oktime");

                            }}
                            onCancel={() => this.setState({ closetime: false })}
                        />) : null
                }
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
                        justifyContent: "flex-end",
                        alignItems: "center",
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        paddingHorizontal: 0,

                    }}>
                        <Pressable
                            onPress={() => {
                                this.setState({ modaladd: false, adTimingid: 0, checkon: false, openSendtime: "", closeSendtime: "", openTme: "", endTime: "" })
                                // console.log(this.state.days, "plas");
                                let select = this.state.day1.map((it) => {
                                    if (it.atSelection == true) {
                                        it.atSelection = false
                                    }
                                    return { ...it }
                                })
                                // console.log(select, "ol");
                                this.setState({ day1: select })
                            }}
                            style={{
                                marginBottom: 10, backgroundColor: "#ffff", borderRadius: 127, borderWidth: 1, borderColor: "#a3a3a3"
                                , width: 40, height: 40, justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Image
                                source={require('../Assets/ico-close.png')}
                                style={{ width: this.state.width < 769 ? 22 : 38, height: this.state.width < 769 ? 18 : 35, }}
                            />
                        </Pressable>
                        <View style={{
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
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
                            <View style={{ alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', }}>Select Days & Time</Text>
                                <View style={{ flexDirection: 'row', marginLeft: -7, marginTop: 10 }}>
                                    {
                                        this.state.day1.map((itme) =>
                                            <Pressable
                                                onPress={() => this.selectmodalDate(itme)}
                                                style={{ alignItems: "center", borderWidth: 1, width: 40, height: 40, borderRadius: 20, marginLeft: 10, marginTop: 10, backgroundColor: itme.isActive == false ? "grey" : itme.atSelection == true ? "#067655" : null }}>
                                                <Text style={{ marginTop: 10, fontFamily: "Poppins-Medium", color: itme.isActive == false ? "#fff" : itme.atSelection == true ? "#fff" : "#000" }}>{itme.day}</Text>
                                            </Pressable>)
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginLeft: -5 }}>
                                <CheckBox
                                    style={{}}
                                    onClick={() => {
                                        this.setState({
                                            checkon: !this.state.checkon
                                        })
                                    }}
                                    isChecked={this.state.checkon}
                                    checkBoxColor={"black"}
                                    checkedCheckBoxColor={"#067655"}
                                />
                                <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 15 }}>Open 24 hours</Text>
                            </View>
                            {
                                this.state.checkon != true ? (<View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                        {
                                            Platform.OS == "ios" ?
                                                <DateTimePickerModal
                                                    testID="dateTimePicker"
                                                    value={this.state.openTme != "" ? new Date(this.state.openSendtime) : this.state.gettime}
                                                    isVisible={this.state.startTime}
                                                    mode="time"
                                                    is24Hour={true}
                                                    display="spinner"
                                                    onConfirm={(date) => {
                                                        console.log("datee", (date));
                                                        var dat = new Date(date).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });
                                                        console.log("open", dat);
                                                        this.setState({ openTme: dat, startTime: false, openSendtime: new Date(date).toJSON() })
                                                        console.log("open time", this.state.openSendtime, this.state.openTme);

                                                    }}
                                                    onCancel={() => this.setState({ startTime: false })}
                                                /> : null}
                                        <Pressable
                                            style={{ backgroundColor: "#EDEDF4", padding: 10, width: 85, borderRadius: 10 }}
                                            onPress={() => this.setState({ startTime: true })}>
                                            <Text>{this.state.openTme == "" ? new Date().toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) : this.state.openTme}</Text>
                                        </Pressable>
                                        <Text style={{ marginHorizontal: 10 }}>To</Text>
                                        {
                                            Platform.OS == "ios" ?
                                                <DateTimePickerModal
                                                    testID="dateTimePicker"
                                                    value={this.state.openTme != "" ? new Date(this.state.openSendtime) : this.state.gettime}
                                                    isVisible={this.state.closetime}
                                                    mode="time"
                                                    is24Hour={true}
                                                    display="spinner"
                                                    onConfirm={(date) => {
                                                        console.log(date);
                                                        var dat = new Date(date).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });
                                                        console.log("close", dat);
                                                        this.setState({ endTime: dat, closetime: false, closeSendtime: new Date(date).toJSON() })
                                                        console.log("end time", this.state.closeSendtime, this.state.endTime);

                                                    }}
                                                    onCancel={() => this.setState({ closetime: false })}
                                                /> : null}

                                        <Pressable style={{ backgroundColor: "#EDEDF4", padding: 10, width: 85, borderRadius: 10 }}
                                            onPress={() => this.setState({ closetime: true })}>
                                            <Text>{this.state.endTime == "" ? new Date().toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) : this.state.endTime}</Text>
                                        </Pressable>

                                    </View>
                                </View>) : null
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Pressable
                                    onPress={() => this.setState({ modaladd: false, adTimingid: 0, checkon: false, openSendtime: "", closeSendtime: "", openTme: "", endTime: "", day1: this.state.days })}
                                >
                                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'OpenSans-Bold' }}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => this.addBusinessTime()}
                                    style={{ backgroundColor: '#067655', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25 }}>
                                    <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'Poppins-SemiBold' }}>Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
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
                        alignItems: "flex-end",
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
                                    style={{ width: 24, height: 24, marginTop: 0, }}
                                />
                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>{this.state.showerror}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                                <Pressable
                                    onPress={() => {
                                        this.setState({ loc: false, modaladd: true })
                                    }}
                                    style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 15 }}
                                >
                                    <Text style={{ fontSize: 15, color: '#C6C6C6', fontFamily: 'OpenSans-Bold' }}>Ok</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}