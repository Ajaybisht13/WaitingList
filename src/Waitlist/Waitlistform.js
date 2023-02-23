import { Dimensions, Text, View, Image, ScrollView, ActivityIndicator, Modal, Pressable, Platform, BackHandler } from 'react-native'
import React, { Component } from 'react'
import ToggleSwitch from 'toggle-switch-react-native'
import { TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { basesUrl } from '../../App';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class Waitlistform extends Component {

    NetInfoSubscribtion = null;

    constructor() {
        super();
        this.state = {
            saveconfi: false,
            toggal1: true,
            toggal2: true,
            toggal3: true,
            toggal4: true,
            toggal5: true,
            textInput: [],
            guest: "",
            guestBox: [],
            time: "",
            timeBox: [],
            seating: "",
            seatingBox: [],
            modalVisiblesp: false,
            modalVisiblesp1: false,
            modalVisiblesp2: false,
            dropdown: ["Fitness", "Restaurant", "BarberShop", "MOMO SHOP"],
            togal: true,
            modaladd: false,
            width: "",
            seatingactiveBox: [],
            modaladddyn: false,
            addText: "",
            modelid: 0,
            busId: 0,
            formDatalist: [],
            table: false,
            tableValue: "",
            locd: false,
            modaladdcan: false,
            emptyfild: false,
            connection_status: false,
            responseData: "",
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        let deviceWidth = Dimensions.get("screen").width;
        let ss = await AsyncStorage.getItem("businessId")
        this.setState({ busId: ss }, () => console.log(this.state.busId, "soal"))
        this.setState({
            width: deviceWidth,
        })
        if (ss != 0) {
            this.update();
        }
        this.getseatingactivelist()
        this.getformlist()
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


    getformlist = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        let buseinssId = this.state.busId
        await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlistForm?businessId=" + buseinssId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data.data, "getformlist")
            this.setState({ formDatalist: re.data.data })
            this.setState({ textInput: re.data.data.waitListFormOthers })
        })
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
            console.log(re.data.data, "pre")
            this.setState({ seatingactiveBox: re.data.data })
        })
    }

    update = async () => {
        let businessesId = this.state.busId;
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token, "dkjfjdsf");
        await axios.get(basesUrl + "v1/Businesses/GetBusinessByID?Id=" + businessesId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log(reuslt.data.data.businessType.name);
            this.setState({
                responseData: reuslt.data.data.businessType.name,
                image: reuslt.data.data.imagePath == null || reuslt.data.data.imagePath == undefined ? null : reuslt.data.data.imagePath.replace(/\\/g, "/"),
            })
        })
    }

    getseatinglist = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        let buseinssId = this.state.busId
        await axios.get(basesUrl + "v1/Businesses/GetBusinessSeatingID?businessId=" + buseinssId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data.data, "preasdddess")
            this.setState({ seatingBox: re.data.data })
        })
    }


    addTextInput = (index) => {
        console.log(this.state.addText.length, "text");
        if (this.state.textInput.length < 10 && this.state.addText.length != 0) {
            let textInput = this.state.textInput;
            textInput.push({ "id": 0, "name": this.state.addText, "isActive": true });
            this.setState({ textInput }, () => console.log("ssss", this.state.textInput));
            this.setState({ modaladddyn: false, addText: "" });
        } else if (this.state.addText.length == 0) {
            this.setState({ emptyfild: true })
        }
    }

    addValue = () => {
        let value = this.state.guest.toString();
        this.state.guestBox.push(value);
        this.setState({ guest: null })
        console.log(this.state.guestBox, value);
    }
    addTimeValue = () => {
        let value = this.state.time.toString();
        this.state.timeBox.push(value);
        this.setState({ time: null })
        console.log(this.state.timeBox, value);
    }

    addSeatingValue = async () => {
        if (this.state.seating != "") {
            let token = await AsyncStorage.getItem("jwtoken")
            let buseinssId = this.state.busId
            let addseatingprefernce = {
                "id": 0,
                "seatingAreaMasterId": 0,
                "businessesId": buseinssId,
                "name": this.state.seating
            }
            await axios.post(basesUrl + "v1/Businesses/AddEditSeating", addseatingprefernce, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }).then((re) => {
                console.log(re.data, "preasdddess")
                this.setState({ modaladd: false, seating: "" });
                this.getseatingactivelist()
            })
        }
    }

    removeTextInput = (item) => {
        console.log(item);
        let newarrya = []
        let seatingbox = this.state.seatingBox.map((items) => {
            if (item.id == items.id) {
                items.isDeleted = !items.isDeleted;
            }
            return { ...items }
        })
        // let textInput = this.state.seatingBox;
        // textInput.pop();
        this.setState({ seatingBox: seatingbox }, () => console.log(this.state.seatingBox, "ok"));
    }

    saveseating = async () => {
        let arrySeating = []
        let seatingbox = this.state.seatingBox.map((items) => {
            let data = {
                "id": items.id,
                "seatingAreaMasterId": items.seatingAreaMasterId,
                "businessesId": items.businessesId,
                "name": items.name,
                "isActive": items.isActive,
                "isDeleted": items.isDeleted,
                "createdBy": "null",
                "createdOn": "2022-12-15T09:46:20.806Z",
                "lastModifiedBy": "string",
                "lastModifiedOn": "2022-12-15T09:46:20.806Z"
            }
            arrySeating.push(data)
            // }
            // return { ...items }
        })
        let token = await AsyncStorage.getItem("jwtoken")

        let seatingprefernce = {
            "seatingAreas": arrySeating
        }
        console.log(seatingprefernce, "seatingprefernce");
        await axios.post(basesUrl + "v1/Businesses/UpdateSeatingArea", seatingprefernce, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            console.log(re.data, "preasdddess")
            this.setState({ modalVisiblesp: false, modaladdcan: false });
            this.getseatingactivelist()
            this.getseatinglist()
        })

        console.log("qqqqqqqqqqqq", arrySeating);
        // this.setState({ seatingBox: arrySeating }, () => console.log(this.state.seatingBox, "ok"));
        // this.setState({ modalVisiblesp: false });
    }

    onOff = (index, value) => {
        console.log(index, "index");
        // let arrySeating = []
        let seatingbox = this.state.textInput.map((items, i) => {
            if (i == index) {
                items.isActive = !items.isActive;
                // arrySeating.push(items)
            }
            return { ...items }
        })
        console.log("qqqqqqqqqqqq", seatingbox);
        this.setState({ textInput: seatingbox })
    }

    adddyncolume = () => {
        console.log(this.state.modelid, "sff", this.state.addText);
        let arrayData = this.state.textInput.map((item) => {
            if (item.id == this.state.modelid) {
                item.name = this.state.addText
            }
            return { ...item }
        })
        console.log("asa", arrayData);
        this.setState({ textInput: arrayData, modaladddyn: false, addText: "" })
    }

    openModel = (value) => {
        console.log(value.id, "sff");
        this.setState({ modaladddyn: true, modelid: value.id })

    }

    listDelete = (value, index) => {
        console.log(value);
        let afterDelete = []
        this.state.textInput.map((itemss, i) => {
            if (i != index) {
                afterDelete.push(itemss)
            }
        })
        // console.log(afterDelete,"delete the item");
        this.setState({ textInput: afterDelete })
    }


    lastSubmit = async () => {
        this.setState({ locd: true });
        let onlytrue = []
        let open = this.state.textInput.map((it) => {
            if (it.isActive == true) {
                console.log("hello");
                onlytrue.push(it)
            }
            return { ...it }
        })
        console.log(onlytrue, "sectionfull", this.state.textInput);
        let lastData = {
            "id": this.state.formDatalist.id,
            "businessesId": this.state.formDatalist.businessesId,
            "customerName": true,
            "seaingArea": true,
            "notes": this.state.formDatalist.notes,
            "quickNotes": false,
            "tableNo": this.state.formDatalist.tableNo,
            "customerEmail": true,
            "waitListFormOthers": this.state.textInput
        }
        console.log("oloolo", lastData);
        let token = await AsyncStorage.getItem("jwtoken")
        await axios.post(basesUrl + "v1/BusinessWaitlist/AddEditWaitlistForm", lastData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((re) => {
            if (re.data.succeeded == true) {
                this.setState({ locd: false })
                this.props.navigation.navigate("Home")
                this.getseatingactivelist()
                this.getformlist()
            } else {
                this.setState({ locd: false })
            }

        })

    }


    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View style={{ height: "100%", backgroundColor: '#EDEDF4' }}>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.locd}
                                onRequestClose={() => {
                                    this.setState({ locd: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    paddingHorizontal: 50,

                                }}>
                                    <ActivityIndicator size="large" color="#B10808" />
                                </View>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modalVisiblesp}
                                onRequestClose={() => {
                                    this.setState({ modalVisiblesp: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: this.state.width < 769 ? "center" : "flex-end",
                                    alignItems: "flex-end",
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    // paddingHorizontal: 50,
                                    // paddingHorizontal: 40
                                    height: '100%'
                                }}>
                                    <View style={{
                                        borderRadius: 10,
                                        backgroundColor: "white",
                                        width: this.state.width < 769 ? '100%' : '100%', height: this.state.width < 769 ? '100%' : "auto", padding: 20, paddingHorizontal: 20,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 9,
                                        },
                                        shadowOpacity: 0.50,
                                        shadowRadius: 12.35,

                                        elevation: 19,
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, marginTop: Platform.OS == "ios" ? "8%" : 0 }}>
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000' }}>Delete predefined responses</Text>
                                        </View>
                                        <ScrollView>
                                            {
                                                this.state.seatingBox.map((item) =>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#707070' }}>
                                                        <Text style={{ fontFamily: item.isDeleted == true ? "OpenSans-SemiBoldItalic" : 'OpenSans-SemiBold', fontSize: 18, color: item.isDeleted == true ? '#A5A5A5' : '#000000', textDecorationLine: item.isDeleted == true ? 'line-through' : 'none' }}>{item.name}</Text>
                                                        <Pressable
                                                            onPress={() => this.removeTextInput(item)}
                                                        >
                                                            {
                                                                item.isDeleted == true ? (<Image
                                                                    source={require('../Assets/ico-undo.png')}
                                                                    style={{ width: 16, height: 20 }}
                                                                />) : (<Image
                                                                    source={require('../Assets/delete.png')}
                                                                    style={{ width: 26, height: 30 }}
                                                                />)
                                                            }

                                                        </Pressable>
                                                    </View>
                                                )
                                            }
                                        </ScrollView>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 45 }}>
                                            <Pressable
                                                onPress={() => this.setState({ modalVisiblesp: false })}
                                            >
                                                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'OpenSans-Bold' }}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.setState({ modaladdcan: true, modalVisiblesp: false })}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25 }}>
                                                <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'Poppins-SemiBold' }}>Save</Text>
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
                                <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-Medium' }}>Manage Waitlist Form</Text>
                                <Pressable
                                    onPress={() => this.props.navigation.navigate("Home")}
                                >
                                    <Image
                                        source={this.state.busId == 0 ? require('../Assets/companyLogo.png') : { uri: "http://apiwaitlist.nubiz.co.in/" + this.state.image }}
                                        style={{ width: this.state.width < 769 ? 50 : 57, height: this.state.width < 769 ? 51 : 58, borderRadius: 100 }}
                                    />
                                </Pressable>
                            </View>
                            <View style={{ backgroundColor: '#EDEDF4', padding: 27, height: this.state.width < 769 && Platform.OS == "android" ? "82%" : this.state.width < 769 && Platform.OS == "ios" ? "79%" : "84%", paddingHorizontal: 15 }}>
                                <ScrollView style={{ backgroundColor: 'white', borderRadius: 10, padding: 15, paddingHorizontal: this.state.width < 769 ? 10 : 23 }}>
                                    <Text style={{ marginTop: this.state.width < 769 ? 5 : 29, fontSize: this.state.width < 769 ? 25 : 32, color: '#000000', fontFamily: 'Poppins-SemiBold', }}>Decide how much information you need from your customers.</Text>
                                    <Text style={{ marginTop: 10, fontSize: this.state.width < 769 ? 16 : 18, color: '#4B4B4B', fontFamily: 'OpenSans-Regular' }}>Add up to 10 custom fields by moving the toggle, then name each one. Or start with a template. <Text style={{ fontSize: 18, color: 'black', fontFamily: 'OpenSans-SemiBold' }}>Time & Date are default fields</Text></Text>
                                    <View style={{
                                        height: 50,
                                        borderColor: 'gray',
                                        borderWidth: 0.5,
                                        borderRadius: 8,
                                        paddingHorizontal: 8,
                                        marginTop: 10, width: this.state.width < 769 ? "100%" : "99.5%",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        display: "flex",
                                        flexDirection: "row"
                                    }}>
                                        <Text style={{ fontSize: this.state.width < 769 ? 16 : 20, }}>{this.state.responseData == undefined || this.state.responseData == null || this.state.responseData == "" ? "Restaurant" : this.state.responseData}</Text>
                                        <View>
                                            <Image source={require("../Assets/Path178.png")} style={{ height: this.state.width < 769 ? 10 : 15 }} resizeMode={"contain"} />
                                        </View>
                                    </View>
                                    {/* <Dropdown
                                        style={{
                                            height: 50,
                                            borderColor: 'gray',
                                            borderWidth: 0.5,
                                            borderRadius: 8,
                                            paddingHorizontal: 8,
                                            marginTop: 10, width: this.state.width < 769 ? "100%" : "99.5%"
                                        }}
                                        placeholderStyle={{ fontSize: this.state.width < 769 ? 16 : 20, }}
                                        selectedTextStyle={{ fontSize: this.state.width < 769 ? 16 : 20, }}
                                        inputSearchStyle={{
                                            height: 40,
                                            fontSize: this.state.width < 769 ? 16 : 20,
                                        }}
                                        iconStyle={{
                                            width: 20,
                                            height: 20,
                                        }}
                                        data={this.state.dropdown}
                                        search
                                        maxHeight={300}
                                        labelField="name"
                                        valueField="id"
                                        placeholder={"Restaurant"}
                                        searchPlaceholder="Search..."
                                        // value={this.state.responseData}
                                        disable={true}
                                    onChange={item => {
                                        this.setState({ businesstypeid: item.id }, () => {
                                            console.log(this.state.businesstypeid, "okbusinesstype");
                                        });
                                        this.setState({ businesstypeerror: false })
                                    }}
                                    /> */}
                                    {/* <View style={{ alignItems: 'center', borderWidth: 1, borderColor: '#C4C4C4', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, width: "100%", paddingVertical: 1, borderRadius: 7 }}>
                        
                            <SelectDropdown
                                data={this.state.dropdown}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item
                                }}
                                renderDropdownIcon={isOpened => {
                                    return (
                                        <View>
                                            {
                                                isOpened ? (<Image
                                                    source={require('../Assets/Path178.png')}
                                                    style={{ transform: [{ rotate: '180deg' }] }}
                                                />) : (<Image
                                                    source={require('../Assets/Path178.png')}

                                                />)
                                            }
                                        </View>
                                    )


                                }}

                                defaultButtonText={'Restaurant'}
                                buttonTextStyle={{ fontSize: this.state.width < 769 ? 20 : 24, fontFamily: "Poppins-Regular", color: "#2A2539", textAlign: "left" }}
                                buttonStyle={{ backgroundColor: 'white', fontSize: this.state.width < 769 ? 20 : 24, fontFamily: "Poppins-Regular", width: "100%", height: this.state.width < 769 ? 50 : 60, }}
                            />
                        </View> */}
                                    <View style={{ marginBottom: 26 }}>
                                        <View style={{ width: '100%', flexDirection: this.state.width < 769 ? "column" : 'row', }}>
                                            <View style={{ marginTop: this.state.width < 769 ? 15 : 25, width: this.state.width < 769 ? "100%" : '49%', }}>
                                                <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, paddingHorizontal: 8, paddingVertical: this.state.width < 769 ? 8 : 10 }}>
                                                    <Text style={{ marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000', fontFamily: 'OpenSans-Regular' }}>Mobile Number</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: this.state.width < 769 ? 15 : 25, marginLeft: this.state.width < 769 ? 0 : 10, width: this.state.width < 769 ? "100%" : '49%', }}>
                                                <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, paddingHorizontal: 8, paddingVertical: this.state.width < 769 ? 8 : 10 }}>
                                                    <Text style={{ fontFamily: 'OpenSans-Regular', marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000' }}>Name</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: this.state.guestBox.length != 0 ? 'flex-start' : "center" }}>
                                            <ToggleSwitch
                                                isOn={this.state.toggal3}
                                                onColor="#41A800"
                                                offColor="#EDEDF4"
                                                size={this.state.width < 769 ? "medium" : "large"}
                                                onToggle={isOn => this.setState({ toggal3: !this.state.toggal3 })}
                                            />
                                            <View style={{ width: this.state.width < 769 ? "85%" : '96%', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, width: '93%', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: this.state.width < 769 ? 0 : Platform.OS == "ios" ? 5 : 0 }}>
                                                    <TextInput
                                                        placeholder='# Of Guest'
                                                        editable={false}
                                                        placeholderTextColor={'#000000'}
                                                        value={this.state.guest}
                                                        keyboardType="numeric"
                                                        selectionColor={'#067655'}
                                                        onChangeText={(value) => this.setState({ guest: value })}
                                                        style={{ fontFamily: 'OpenSans-Regular', marginLeft: 8, fontSize: this.state.width < 769 ? 18 : 24, color: '#000000', width: '60%' }} />
                                                    <Pressable
                                                    // onPress={() => this.addValue()}
                                                    >
                                                        <Image
                                                            source={require('../Assets/ico-addOptions.png')}
                                                            style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                        />
                                                    </Pressable>
                                                </View>
                                                {
                                                    this.state.guestBox.length != 0 ? (<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 7, marginTop: 5, height: this.state.width < 769 ? 50 : 60 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            {
                                                                this.state.guestBox.map((item) =>
                                                                    <View style={{ borderWidth: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 66, marginLeft: 10 }}>
                                                                        <Text style={{ fontSize: this.state.width < 769 ? 18 : 18, color: '#000000', fontFamily: 'OpenSans-Regular' }}>{item}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        </View>
                                                        {/* <Text style={{marginLeft:8, fontSize:24, color:'#000000'}}>Seating Preference</Text> */}
                                                        <Pressable
                                                            onPress={() => this.setState({ modalVisiblesp2: true })}
                                                        >
                                                            <Image
                                                                source={require('../Assets/ico-delete.png')}
                                                                style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                            />
                                                        </Pressable>
                                                    </View>) : null
                                                }

                                            </View>
                                        </View>
                                        <View>
                                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: this.state.seatingactiveBox.length != 0 ? 'flex-start' : "center" }}>
                                                <ToggleSwitch
                                                    isOn={this.state.formDatalist.seaingArea}
                                                    onColor="#41A800"
                                                    offColor="#EDEDF4"
                                                    size="medium"
                                                    onToggle={isOn => {
                                                        console.log(isOn, "ok")
                                                        this.setState(Object.assign(this.state.formDatalist, { seaingArea: isOn }));
                                                    }}
                                                />
                                                <View style={{ width: this.state.width < 769 ? "85%" : '96%', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, width: '93%', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: this.state.width < 769 ? 0 : Platform.OS == "ios" ? 5 : 0 }}>
                                                        <TextInput
                                                            placeholder='Seating Preference'
                                                            placeholderTextColor={'#000000'}

                                                            selectionColor={'#067655'}
                                                            editable={false} selectTextOnFocus={false}

                                                            style={{ fontFamily: 'OpenSans-Regular', marginLeft: 8, fontSize: this.state.width < 769 ? 18 : 24, color: '#000000', width: '65%' }} />
                                                        <Pressable
                                                            onPress={() => this.setState({ modaladd: true })}
                                                        // onPress={() => this.addSeatingValue()}
                                                        >
                                                            <Image
                                                                source={require('../Assets/ico-addOptions.png')}
                                                                style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                    {
                                                        this.state.seatingactiveBox.length != 0 ? (<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 4, marginTop: 5, width: '93%', }}>
                                                            <ScrollView
                                                                horizontal={true}
                                                            >
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    {
                                                                        this.state.seatingactiveBox.map((item) =>
                                                                            <Pressable
                                                                                style={{ borderWidth: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 66, marginLeft: 10 }}>
                                                                                <Text style={{ fontSize: this.state.width < 769 ? 15 : 20, color: '#000000', fontFamily: 'OpenSans-Regular' }}>{item.name}</Text>
                                                                            </Pressable>
                                                                        )
                                                                    }
                                                                </View>
                                                            </ScrollView>
                                                            {/* <Text style={{marginLeft:8, fontSize:24, color:'#000000'}}>Seating Preference</Text> */}
                                                            <Pressable
                                                                onPress={() => { this.setState({ modalVisiblesp: true }), this.getseatinglist() }}
                                                            >
                                                                <Image
                                                                    source={require('../Assets/ico-delete.png')}
                                                                    style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                                />
                                                            </Pressable>
                                                        </View>) : null
                                                    }

                                                </View>
                                            </View>
                                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: this.state.timeBox.length != 0 ? 'flex-start' : "center" }}>
                                                <ToggleSwitch
                                                    isOn={this.state.formDatalist.notes}
                                                    onColor="#41A800"
                                                    offColor="#EDEDF4"
                                                    size="medium"
                                                    onToggle={isOn => {
                                                        console.log(isOn, "ok")
                                                        this.setState(Object.assign(this.state.formDatalist, { notes: isOn }));
                                                    }}
                                                />
                                                <View style={{ width: this.state.width < 769 ? "84%" : '96%', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, width: '93%', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: this.state.width < 769 ? 0 : Platform.OS == "ios" ? 5 : 0 }}>
                                                        <TextInput
                                                            placeholder='Note'
                                                            placeholderTextColor={'#000000'}
                                                            editable={false}
                                                            value={this.state.time}
                                                            keyboardType="numeric"
                                                            selectionColor={'#067655'}
                                                            onChangeText={(value) => this.setState({ time: value })}
                                                            style={{ fontFamily: 'OpenSans-Regular', marginLeft: 8, fontSize: this.state.width < 769 ? 18 : 24, color: '#000000', width: '60%' }} />
                                                        <Pressable
                                                        // onPress={() => this.addTimeValue()}
                                                        >
                                                            <Image
                                                                source={require('../Assets/ico-addOptions.png')}
                                                                style={{ width: this.state.width < 769 ? 40 : 45, height: this.state.width < 769 ? 40 : 45, }}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                    {
                                                        this.state.timeBox.length != 0 ? (<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 7, marginTop: 5 }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                {
                                                                    this.state.timeBox.map((item) =>
                                                                        <View style={{ borderWidth: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 66, marginLeft: 10 }}>
                                                                            <Text style={{ fontSize: this.state.width < 769 ? 18 : 24, color: '#000000', fontFamily: 'OpenSans-Regular' }}>{item}</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            </View>
                                                            {/* <Text style={{marginLeft:8, fontSize:24, color:'#000000'}}>Seating Preference</Text> */}
                                                            <Pressable
                                                                onPress={() => this.setState({ modalVisiblesp1: true })}
                                                            >
                                                                <Image
                                                                    source={require('../Assets/ico-delete.png')}
                                                                    style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                                />
                                                            </Pressable>
                                                        </View>) : null
                                                    }

                                                </View>
                                            </View>
                                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: this.state.timeBox.length != 0 ? 'flex-start' : "center" }}>
                                                <ToggleSwitch
                                                    isOn={this.state.formDatalist.tableNo}
                                                    onColor="#41A800"
                                                    offColor="#EDEDF4"
                                                    size="medium"
                                                    onToggle={isOn => {
                                                        console.log(isOn, "ok")
                                                        this.setState(Object.assign(this.state.formDatalist, { tableNo: isOn }));
                                                    }}
                                                />
                                                <View style={{ width: this.state.width < 769 ? "84%" : '96%', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, width: '93%', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: this.state.width < 769 ? 0 : Platform.OS == "ios" ? 5 : 0 }}>
                                                        <TextInput
                                                            placeholder='Table'
                                                            placeholderTextColor={'#000000'}
                                                            editable={false}
                                                            value={this.state.time}
                                                            keyboardType="numeric"
                                                            selectionColor={'#067655'}
                                                            onChangeText={(value) => this.setState({ time: value })}
                                                            style={{ fontFamily: 'OpenSans-Regular', marginLeft: 8, fontSize: this.state.width < 769 ? 18 : 24, color: '#000000', width: '60%' }} />
                                                        <Pressable
                                                        // onPress={() => this.addTimeValue()}
                                                        >
                                                            <Image
                                                                source={require('../Assets/ico-addOptions.png')}
                                                                style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                    {
                                                        this.state.timeBox.length != 0 ? (<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: 27, justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 7, marginTop: 5 }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                {
                                                                    this.state.timeBox.map((item) =>
                                                                        <View style={{ borderWidth: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 66, marginLeft: 10 }}>
                                                                            <Text style={{ fontSize: this.state.width < 769 ? 18 : 24, color: '#000000', fontFamily: 'OpenSans-Regular' }}>{item}</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            </View>
                                                            {/* <Text style={{marginLeft:8, fontSize:24, color:'#000000'}}>Seating Preference</Text> */}
                                                            <Pressable
                                                                onPress={() => this.setState({ modalVisiblesp1: true })}
                                                            >
                                                                <Image
                                                                    source={require('../Assets/ico-delete.png')}
                                                                    style={{ width: this.state.width < 769 ? 40 : 46, height: this.state.width < 769 ? 40 : 46 }}
                                                                />
                                                            </Pressable>
                                                        </View>) : null
                                                    }

                                                </View>
                                            </View>
                                        </View>

                                        {
                                            this.state.textInput.map((value, index) => <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                                <ToggleSwitch
                                                    isOn={value.isActive}
                                                    onColor="#41A800"
                                                    offColor="#EDEDF4"
                                                    size="medium"
                                                    onToggle={isOn => {
                                                        console.log(index, "index");
                                                        // let arrySeating = []
                                                        let seatingbox = this.state.textInput.map((items, i) => {
                                                            if (i == index) {
                                                                items.isActive = !items.isActive;
                                                                // arrySeating.push(items)
                                                            }
                                                            return { ...items }
                                                        })
                                                        console.log("qqqqqqqqqqqq", seatingbox);
                                                        this.setState({ textInput: seatingbox })
                                                    }}
                                                />
                                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDF4', borderRadius: 7, marginLeft: this.state.width < 769 ? 17 : 26.4, width: this.state.width < 769 ? "78%" : '89%', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 7 }}>
                                                    <Text style={{ fontFamily: 'OpenSans-Regular', marginLeft: 8, fontSize: 18, color: '#000000' }}>{value.name}</Text>
                                                    <Pressable onPress={() =>
                                                        this.setState({
                                                            saveconfi: true,
                                                            value: value,
                                                            index: index
                                                        })
                                                        // this.listDelete(value, index)
                                                    }
                                                    >
                                                        <Image
                                                            source={require('../Assets/ico-delete.png')}
                                                            style={{ width: 40, height: 40 }}
                                                        />
                                                    </Pressable>
                                                </View>
                                            </View>
                                            )}
                                        <Pressable
                                            onPress={() => this.setState({ modaladddyn: true })}
                                            style={{ backgroundColor: '#41A800', marginTop: 35, paddingHorizontal: 30, paddingVertical: 13, borderRadius: 60, marginBottom: 20, width: this.state.width < 769 ? "70%" : 240 }}>
                                            <Text style={{ color: 'white', fontSize: 20, fontFamily: 'OpenSans-SemiBold' }}>+ Add a column</Text>
                                        </Pressable>
                                    </View>
                                </ScrollView>
                            </View>
                            <Pressable
                                onPress={() => this.lastSubmit()}
                                style={{ position: 'absolute', bottom: 0, backgroundColor: '#067655', width: '100%', paddingVertical: 15 }}>
                                <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', fontFamily: 'OpenSans-SemiBold' }}>Submit</Text>
                            </Pressable>
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
                                    alignItems: "flex-end",
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
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000' }}>Add predefined responses</Text>
                                        </View>
                                        <View style={{}}>
                                            <TextInput
                                                placeholder='e.g “Outdoor” or similar'
                                                placeholderTextColor={'#000000'}
                                                value={this.state.seating}
                                                selectionColor={'#067655'}
                                                maxLength={20}
                                                onChangeText={(value) => this.setState({ seating: value })}
                                                style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: '#000000', borderRadius: 7, backgroundColor: '#EDEDF4', paddingLeft: 10, paddingVertical: Platform.OS == "ios" ? 10 : 10 }} />
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 23 }}>
                                            <Pressable
                                                onPress={() => this.setState({ modaladd: false, seating: "" })}
                                            >
                                                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'OpenSans-Bold' }}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.addSeatingValue()}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25 }}>
                                                <Text style={{ fontSize: 20, color: '#ffff', fontFamily: 'Poppins-SemiBold' }}>Add</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modaladddyn}
                                onRequestClose={() => {
                                    this.setState({ modaladddyn: false });
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
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000' }}>Add Custom Label</Text>
                                        </View>
                                        <View style={{}}>
                                            <TextInput
                                                placeholder='e.g “Outdoor” or similar'
                                                placeholderTextColor={'#000000'}
                                                value={this.state.addText}
                                                selectionColor={'#067655'}
                                                maxLength={30}
                                                onChangeText={(value) => this.setState({ addText: value, emptyfild: false })}
                                                style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: '#000000', borderRadius: 7, backgroundColor: '#EDEDF4', paddingLeft: 10, paddingVertical: Platform.OS == "ios" ? 10 : 10, borderColor: this.state.emptyfild == true ? "red" : null, borderWidth: this.state.emptyfild == true ? 1 : null }} />
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 23 }}>
                                            <Pressable
                                                onPress={() => this.setState({ modaladddyn: false })}
                                            >
                                                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'OpenSans-Bold' }}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.addTextInput(this.state.textInput.length)}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25 }}>
                                                <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'Poppins-SemiBold' }}>Add</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
                                                style={{ width: this.state.width < 769 ? 35 : 38, height: this.state.width < 769 ? 35 : 38, }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Are you sure want to delete ?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                onPress={() => {
                                                    this.setState({ saveconfi: false, finalChek: true })
                                                    this.listDelete(this.state.value, this.state.index)
                                                }}
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
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Would you like to Save ?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                onPress={() => this.saveseating()}
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
                        </View> :
                        <View>
                            <InternetCheck />
                        </View>
                }
            </View>
        )
    }
}