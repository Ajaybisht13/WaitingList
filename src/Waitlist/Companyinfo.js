import { ActivityIndicator, Dimensions, Text, View, Image, ScrollView, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, PermissionsAndroid, Platform, BackHandler } from 'react-native'
import React, { Component } from 'react'
import ToggleSwitch from 'toggle-switch-react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from "react-native-image-picker"
import Geolocation from 'react-native-geolocation-service';
import { gstNumber, checkPhone, userEmail, checkPincode } from '../Validation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { basesUrl } from '../../App';
import { Dropdown } from 'react-native-element-dropdown';
import { request, PERMISSIONS } from 'react-native-permissions';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class Companyinfo extends Component {

    NetInfoSubscribtion = null;

    constructor() {
        super();
        this.state = {
            busID: 0,
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
            businessType: [],
            togal: true,
            modaladd: false,
            devices: true,
            profile: "",
            gstNum: "",
            gsterror: false,
            PinCode: "",
            Mobileno: "",
            mobileerror: false,
            Email: "",
            emailerror: false,
            width: "",
            companyname: "",
            companynameerror: false,
            website: "",
            websiteerror: false,
            address: "",
            floor: "",
            countrylist: [{ "id": 2, "name": "Andorra" }, { "id": 3, "name": "United Arab Emirates" }, { "id": 4, "name": "Afghanistan" }, { "id": 5, "name": "Antigua and Barbuda" }, { "id": 6, "name": "Anguilla" }, { "id": 7, "name": "Albania" }, { "id": 8, "name": "Armenia" }, { "id": 9, "name": "Netherlands Antilles" }, { "id": 10, "name": "Angola" }, { "id": 11, "name": "Argentina" }, { "id": 12, "name": "Austria" }, { "id": 13, "name": "Australia" }, { "id": 14, "name": "Aruba" }, { "id": 15, "name": "Azerbaijan" }, { "id": 16, "name": "Bosnia and Herzegovina" }, { "id": 17, "name": "Barbados" }, { "id": 18, "name": "Bangladesh" }, { "id": 19, "name": "Belgium" }, { "id": 20, "name": "Burkina Faso" }, { "id": 21, "name": "Bulgaria" }, { "id": 22, "name": "Bahrain" }, { "id": 23, "name": "Burundi" }, { "id": 24, "name": "Benin" }, { "id": 25, "name": "Bermuda" }, { "id": 26, "name": "Brunei Darussalam" }, { "id": 27, "name": "Bolivia" }, { "id": 28, "name": "Brazil" }, { "id": 29, "name": "Bahamas" }, { "id": 30, "name": "Bhutan" }, { "id": 31, "name": "Botswana" }, { "id": 32, "name": "Belarus" }, { "id": 33, "name": "Belize" }, { "id": 34, "name": "Canada" }, { "id": 35, "name": "Cocos (Keeling) Islands" }, { "id": 36, "name": "Democratic Republic of the Congo" }, { "id": 37, "name": "Central African Republic" }, { "id": 38, "name": "Congo" }, { "id": 39, "name": "Switzerland" }, { "id": 40, "name": "Cote D'Ivoire (Ivory Coast)" }, { "id": 41, "name": "Cook Islands" }, { "id": 42, "name": "Chile" }, { "id": 43, "name": "Cameroon" }, { "id": 44, "name": "China" }, { "id": 45, "name": "Colombia" }, { "id": 46, "name": "Costa Rica" }, { "id": 47, "name": "Cuba" }, { "id": 48, "name": "Cape Verde" }, { "id": 49, "name": "Christmas Island" }, { "id": 50, "name": "Cyprus" }, { "id": 51, "name": "Czech Republic" }, { "id": 52, "name": "Germany" }, { "id": 53, "name": "Djibouti" }, { "id": 54, "name": "Denmark" }, { "id": 55, "name": "Dominica" }, { "id": 56, "name": "Dominican Republic" }, { "id": 57, "name": "Algeria" }, { "id": 58, "name": "Ecuador" }, { "id": 59, "name": "Estonia" }, { "id": 60, "name": "Egypt" }, { "id": 61, "name": "Western Sahara" }, { "id": 62, "name": "Eritrea" }, { "id": 63, "name": "Spain" }, { "id": 64, "name": "Ethiopia" }, { "id": 65, "name": "Finland" }, { "id": 66, "name": "Fiji" }, { "id": 67, "name": "Falkland Islands (Malvinas)" }, { "id": 68, "name": "Federated States of Micronesia" }, { "id": 69, "name": "Faroe Islands" }, { "id": 70, "name": "France" }, { "id": 71, "name": "Gabon" }, { "id": 72, "name": "Great Britain (UK)" }, { "id": 73, "name": "Grenada" }, { "id": 74, "name": "Georgia" }, { "id": 75, "name": "French Guiana" }, { "id": 76, "name": "Guernsey" }, { "id": 77, "name": "Ghana" }, { "id": 78, "name": "Gibraltar" }, { "id": 79, "name": "Greenland" }, { "id": 80, "name": "Gambia" }, { "id": 81, "name": "Guinea" }, { "id": 82, "name": "Guadeloupe" }, { "id": 83, "name": "Equatorial Guinea" }, { "id": 84, "name": "Greece" }, { "id": 85, "name": "S. Georgia and S. Sandwich Islands" }, { "id": 86, "name": "Guatemala" }, { "id": 87, "name": "Guinea-Bissau" }, { "id": 88, "name": "Guyana" }, { "id": 89, "name": "Hong Kong" }, { "id": 90, "name": "Honduras" }, { "id": 91, "name": "Croatia (Hrvatska)" }, { "id": 92, "name": "Haiti" }, { "id": 93, "name": "Hungary" }, { "id": 94, "name": "Indonesia" }, { "id": 95, "name": "Ireland" }, { "id": 96, "name": "Israel" }, { "id": 97, "name": "India" }, { "id": 98, "name": "Iraq" }, { "id": 99, "name": "Iran" }, { "id": 100, "name": "Iceland" }, { "id": 101, "name": "Italy" }, { "id": 102, "name": "Jamaica" }, { "id": 103, "name": "Jordan" }, { "id": 104, "name": "Japan" }, { "id": 105, "name": "Kenya" }, { "id": 106, "name": "Kyrgyzstan" }, { "id": 107, "name": "Cambodia" }, { "id": 108, "name": "Kiribati" }, { "id": 109, "name": "Comoros" }, { "id": 110, "name": "Saint Kitts and Nevis" }, { "id": 111, "name": "Korea (North)" }, { "id": 112, "name": "Korea (South)" }, { "id": 113, "name": "Kuwait" }, { "id": 114, "name": "Cayman Islands" }, { "id": 115, "name": "Kazakhstan" }, { "id": 116, "name": "Laos" }, { "id": 117, "name": "Lebanon" }, { "id": 118, "name": "Saint Lucia" }, { "id": 119, "name": "Liechtenstein" }, { "id": 120, "name": "Sri Lanka" }, { "id": 121, "name": "Liberia" }, { "id": 122, "name": "Lesotho" }, { "id": 123, "name": "Lithuania" }, { "id": 124, "name": "Luxembourg" }, { "id": 125, "name": "Latvia" }, { "id": 126, "name": "Libya" }, { "id": 127, "name": "Morocco" }, { "id": 128, "name": "Monaco" }, { "id": 129, "name": "Moldova" }, { "id": 130, "name": "Madagascar" }, { "id": 131, "name": "Marshall Islands" }, { "id": 132, "name": "Macedonia" }, { "id": 133, "name": "Mali" }, { "id": 134, "name": "Myanmar" }, { "id": 135, "name": "Mongolia" }, { "id": 136, "name": "Macao" }, { "id": 137, "name": "Northern Mariana Islands" }, { "id": 138, "name": "Martinique" }, { "id": 139, "name": "Mauritania" }, { "id": 140, "name": "Montserrat" }, { "id": 141, "name": "Malta" }, { "id": 142, "name": "Mauritius" }, { "id": 143, "name": "Maldives" }, { "id": 144, "name": "Malawi" }, { "id": 145, "name": "Mexico" }, { "id": 146, "name": "Malaysia" }, { "id": 147, "name": "Mozambique" }, { "id": 148, "name": "Namibia" }, { "id": 149, "name": "New Caledonia" }, { "id": 150, "name": "Niger" }, { "id": 151, "name": "Norfolk Island" }, { "id": 152, "name": "Nigeria" }, { "id": 153, "name": "Nicaragua" }, { "id": 154, "name": "Netherlands" }, { "id": 155, "name": "Norway" }, { "id": 156, "name": "Nepal" }, { "id": 157, "name": "Nauru" }, { "id": 158, "name": "Niue" }, { "id": 159, "name": "New Zealand (Aotearoa)" }, { "id": 160, "name": "Oman" }, { "id": 161, "name": "Panama" }, { "id": 162, "name": "Peru" }, { "id": 163, "name": "French Polynesia" }, { "id": 164, "name": "Papua New Guinea" }, { "id": 165, "name": "Philippines" }, { "id": 166, "name": "Pakistan" }, { "id": 167, "name": "Poland" }, { "id": 168, "name": "Saint Pierre and Miquelon" }, { "id": 169, "name": "Pitcairn" }, { "id": 170, "name": "Palestinian Territory" }, { "id": 171, "name": "Portugal" }, { "id": 172, "name": "Palau" }, { "id": 173, "name": "Paraguay" }, { "id": 174, "name": "Qatar" }, { "id": 175, "name": "Reunion" }, { "id": 176, "name": "Romania" }, { "id": 177, "name": "Russian Federation" }, { "id": 178, "name": "Rwanda" }, { "id": 179, "name": "Saudi Arabia" }, { "id": 180, "name": "Solomon Islands" }, { "id": 181, "name": "Seychelles" }, { "id": 182, "name": "Sudan" }, { "id": 183, "name": "Sweden" }, { "id": 184, "name": "Singapore" }, { "id": 185, "name": "Saint Helena" }, { "id": 186, "name": "Slovenia" }, { "id": 187, "name": "Svalbard and Jan Mayen" }, { "id": 188, "name": "Slovakia" }, { "id": 189, "name": "Sierra Leone" }, { "id": 190, "name": "San Marino" }, { "id": 191, "name": "Senegal" }, { "id": 192, "name": "Somalia" }, { "id": 193, "name": "Suriname" }, { "id": 194, "name": "Sao Tome and Principe" }, { "id": 195, "name": "El Salvador" }, { "id": 196, "name": "Syria" }, { "id": 197, "name": "Swaziland" }, { "id": 198, "name": "Turks and Caicos Islands" }, { "id": 199, "name": "Chad" }, { "id": 200, "name": "French Southern Territories" }, { "id": 201, "name": "Togo" }, { "id": 202, "name": "Thailand" }, { "id": 203, "name": "Tajikistan" }, { "id": 204, "name": "Tokelau" }, { "id": 205, "name": "Turkmenistan" }, { "id": 206, "name": "Tunisia" }, { "id": 207, "name": "Tonga" }, { "id": 208, "name": "Turkey" }, { "id": 209, "name": "Trinidad and Tobago" }, { "id": 210, "name": "Tuvalu" }, { "id": 211, "name": "Taiwan" }, { "id": 212, "name": "Tanzania" }, { "id": 213, "name": "Ukraine" }, { "id": 214, "name": "Uganda" }, { "id": 215, "name": "Uruguay" }, { "id": 216, "name": "Uzbekistan" }, { "id": 217, "name": "Saint Vincent and the Grenadines" }, { "id": 218, "name": "Venezuela" }, { "id": 219, "name": "Virgin Islands (British)" }, { "id": 220, "name": "Virgin Islands (U.S.)" }, { "id": 221, "name": "Viet Nam" }, { "id": 222, "name": "Vanuatu" }, { "id": 223, "name": "Wallis and Futuna" }, { "id": 224, "name": "Samoa" }, { "id": 225, "name": "Yemen" }, { "id": 226, "name": "Mayotte" }, { "id": 227, "name": "South Africa" }, { "id": 228, "name": "Zambia" }, { "id": 229, "name": "Zaire (former)" }, { "id": 230, "name": "Zimbabwe" }, { "id": 231, "name": "United States of America" }, { "id": 232, "name": "Inds" }, { "id": 233, "name": "Fsa" }, { "id": 234, "name": "dd" }, { "id": 235, "name": "ssddd" }, { "id": 236, "name": "New India" }, { "id": 237, "name": "dsd" }, { "id": 238, "name": "fdfds" }],
            countryid: 0,
            countryerror: 0,
            statelist: [],
            stateid: 0,
            stateerror: false,
            pincode: "",
            pincodeerror: false,
            citylist: [],
            cityid: 0,
            cityerror: false,
            photo: null,
            businesstypeid: 0,
            businesstypeerror: false,
            Latitude: 0,
            Longitude: 0,
            image: null,
            defaultbusinesstypevalue: "Business Type",
            profileObj: null,
            defaultcountryname: "Select Country",
            defaultstatename: "Select State",
            defaultcityname: "Select City",
            profilDP: "",
            departmentisFocus: false,
            showCorrectgst: false,
            disdropdowntype: false,
            loc: false,
            locd: false,
            connection_status: false,
        }
    }

    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const auth = await Geolocation.requestAuthorization("whenInUse");
            if (auth === "granted") {
                this.getLocation();
            }
        }
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Geolocation Permission',
                        message: 'Can we access your location?',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                console.log('granted', granted);
                if (granted === 'granted') {
                    console.log('You can use Geolocation');
                    this.getLocation();
                    return true;
                } else {
                    console.log('You cannot use Geolocation');
                    return false;
                }
            } catch (err) {
                return false;
            }
        }
    };

    requestCameraPermission = async () => {
        if (Platform.OS == "ios") {
            request(PERMISSIONS.IOS.CAMERA).then((result) => {
                console.log(result)
                if (result == "granted") {
                    this.handleTakePhoto();
                } else {

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
                    console.log("Camera permission given");
                    this.handleTakePhoto();
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };


    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        let userEmail = await AsyncStorage.getItem("userEmail");
        let userPhone = await AsyncStorage.getItem("userPhone");
        let ss = await AsyncStorage.getItem("businessId")
        this.setState({ busID: ss }, () => console.log(this.state.busID, "apskddhsaossddsjk"))
        this.businesstype();
        this.countryList();
        let businessesId = 23

        console.log(businessesId, "busin", this.state.profileObj);
        if (ss != 0) {
            this.update()
        } else {
            this.setState({ Email: userEmail, Mobileno: userPhone }, () => {
                console.log(this.state.Mobileno, "Mobileno", this.state.Email);
            })
        }
        let deviceWidth = Dimensions.get("screen").width
        this.setState({ width: deviceWidth })

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

    addTextInput = (index) => {
        if (this.state.textInput.length < 10) {
            let textInput = this.state.textInput;
            textInput.push({ "id": this.state.textInput.length + 1, "textValue": "part", "showFilde": true });
            this.setState({ textInput }, () => console.log("ssss", this.state.textInput));
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

    addSeatingValue = () => {
        if (this.state.seating != "") {
            let data = {
                "inputValue": this.state.seating.toString(),
                "delete": false
            }
            this.state.seatingBox.push(data);
            this.setState({ seating: null })
            console.log(this.state.seatingBox);
            this.setState({ modaladd: false })
        }
    }

    removeTextInput = (item) => {
        console.log(item);
        let seatingbox = this.state.seatingBox.map((items) => {
            if (item.inputValue == items.inputValue) {
                items.delete = !items.delete;

            }
            return { ...items }
        })
        // let textInput = this.state.seatingBox;
        // textInput.pop();
        this.setState({ seatingBox: seatingbox }, () => console.log(this.state.seatingBox, "ok"));
    }
    removeTextInput1 = () => {
        let textInput = this.state.timeBox;
        textInput.pop();
        this.setState({ timeBox: textInput });
    }
    removeTextInput2 = () => {
        let textInput = this.state.guestBox;
        textInput.pop();
        this.setState({ guestBox: textInput });
    }

    saveseating = () => {
        let arrySeating = []
        let seatingbox = this.state.seatingBox.map((items) => {
            if (items.delete == false) {
                arrySeating.push(items)
            }
            return { ...items }
        })
        console.log("qqqqqqqqqqqq", arrySeating);
        this.setState({ seatingBox: arrySeating }, () => console.log(this.state.seatingBox, "ok"));
        this.setState({ modalVisiblesp: false });
    }

    onOff = (index, value) => {
        console.log(index.id);
        // let arrySeating = []
        let seatingbox = this.state.textInput.map((items) => {
            if (index.id == items.id) {
                items.showFilde = !items.showFilde;
                // arrySeating.push(items)
            }
            return { ...items }
        })
        console.log("qqqqqqqqqqqq", seatingbox);
        this.setState({ textInput: seatingbox })
    }
    handleChoosePhoto = () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            this.setState({ photo: response.assets })
            console.log(response.assets, "image");
            if (response.assets != undefined) {
                this.setState({ profile: response.assets[0].uri })
                this.setState({ modaladd: false });
            } else {
                console.log("hello");
            }

        })
    }

    handleTakePhoto = () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchCamera(options, response => {
            console.log(response, "aaa");
            this.setState({ photo: response.assets })
            if (response.assets != undefined) {
                this.setState({ profile: response.assets[0].uri })
                this.setState({ modaladd: false });
            } else {
                console.log("hello");
            }
        })
    }

    getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                let loc = {
                    "latitude": position.coords.latitude,
                    "longitude": position.coords.longitude
                }
                console.log(loc);
                this.setState({ loc: true })
                this.setState({ Latitude: position.coords.latitude, Longitude: position.coords.longitude })
                // Geocoder.from(loc)
                //     .then(json => {
                //         var location = json.results[0].geometry.location;
                //         console.log(location);
                //     })
                //     .catch(error => console.warn(error));
                // let latitude = position.coords.latitude
                // let longitude = position.coords.longitude
                // console.log(position.coords.longitude);
                // setLocation(position);

            },
            error => {
                // See error code charts below.
                console.log(error.code, error.message);
                // setLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }


    checkValue = () => {
        let gst = gstNumber(this.state.gstNum);
        console.log("ss", gst);
    }

    businesstype = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token);
        await axios.get(basesUrl + "v1/Businesses/GetBusinessTypeDDL", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            this.setState({ businessType: reuslt.data.data }, () => console.log("appppppppppppppp", this.state.businessType))
        })
    }

    countryList = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token);
        await axios.get(basesUrl + "v1/Geolocation/GetCountryDDL", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log("data", reuslt.data.data),
                this.setState({ countrylist: reuslt.data.data })
            this.stateList()
        })
    }
    stateList = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token);
        await axios.get(basesUrl + "v1/Geolocation/GetStateDDL?countryID=" + this.state.countryid, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log("data", reuslt.data.data),
                this.setState({ statelist: reuslt.data.data })
            this.cityList()
        })
    }
    cityList = async () => {
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token);
        await axios.get(basesUrl + "v1/Geolocation/GetCityDDL?stateID=" + this.state.stateid, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log("data", reuslt.data.data),
                this.setState({ citylist: reuslt.data.data })
        })
    }


    update = async () => {
        let businessesId = this.state.busID
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token, "dkjfjdsf");
        await axios.get(basesUrl + "v1/Businesses/GetBusinessByID?Id=" + businessesId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log("data", reuslt.data.data)
            // console.log("data", reuslt.data.data)
            this.setState({ profileObj: reuslt.data.data })
            this.setState({
                image: reuslt.data.data.imagePath == null || reuslt.data.data.imagePath == undefined ? null : reuslt.data.data.imagePath.replace(/\\/g, "/"),
                businesstypeid: reuslt.data.data.businessTypeId,
                gstNum: reuslt.data.data.gstnNo,
                companyname: reuslt.data.data.name,
                website: reuslt.data.data.webSite,
                Mobileno: reuslt.data.data.phone,
                Email: reuslt.data.data.email,
                Latitude: reuslt.data.data.latitude,
                Longitude: reuslt.data.data.longitude,
                address: reuslt.data.data.address,
                pincode: reuslt.data.data.pinCode,
                defaultbusinesstypevalue: reuslt.data.data.typeName, countryid: reuslt.data.data.countryId, stateid: reuslt.data.data.stateId, cityid: reuslt.data.data.cityId, defaultcountryname: reuslt.data.data.country, defaultstatename: reuslt.data.data.state, defaultcityname: reuslt.data.data.cityName, profilDP: reuslt.data.data.imagePath
            })
            let businty = reuslt.data.data.businessTypeId
            if (businty != 0) {
                this.setState({ disdropdowntype: true })
            }

            let gstt = gstNumber(reuslt.data.data.gstnNo)
            if (gstt == true) {
                this.setState({ showCorrectgst: true })
            } else {
                this.setState({ showCorrectgst: false })
            }
            this.stateList()
            this.cityList()
        })
    }


    checkGst = (text) => {
        this.setState({ gstNum: text, gsterror: false })
        let gstCheck = gstNumber(text)
        if (gstCheck == true) {
            this.setState({ showCorrectgst: true })
        } else {
            this.setState({ showCorrectgst: false })
        }

    }


    callNewfu = async (item) => {
        console.log("iii", item.id);

        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token);
        this.setState({
            countryid: item.id,
            stateid: 0,
            defaultstatename: "Select State",
            cityid: 0,
            defaultcityname: "Select City",
            countryerror: false
        }
            , () => {
                console.log(this.state.countryid, "fhkkh", item.id);
            });
        // await AsyncStorage.setItem("countryid", this.state.countryId.toString())
        console.log(basesUrl + "v1/Geolocation/GetStateDDL?countryID=" + item.id, "ok");
        await axios.get(basesUrl + "v1/Geolocation/GetStateDDL?countryID=" + item.id, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log("data", reuslt.data.data),
                this.setState({ statelist: reuslt.data.data })

        })

    }

    callstate = async (item) => {
        console.log(this.state.countryid, "fhkkh77666");
        let token = await AsyncStorage.getItem("jwtoken")
        console.log(token);
        this.setState({
            stateid: item.id,
            stateerror: false,
            cityid: 0,
            defaultcityname: "Select City"
        }, () => {
            console.log(this.state.stateid, "okState");
        });
        console.log(basesUrl + "v1/Geolocation/GetCityDDL?stateID=" + item.id, "stat");
        await axios.get(basesUrl + "v1/Geolocation/GetCityDDL?stateID=" + item.id, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((reuslt) => {
            console.log("data", reuslt.data.data),
                this.setState({ citylist: reuslt.data.data })
        })
    }

    submitinfo = async () => {
        let mobile = checkPhone(this.state.Mobileno)
        let gmail = userEmail(this.state.Email)
        let pinCode = checkPincode(this.state.pincode)
        if (mobile == false) {
            this.setState({ mobileerror: true })
        }
        if (gmail == false) {
            this.setState({ emailerror: true })
        }
        if (pinCode == false) {
            this.setState({ pincodeerror: true })
        }
        if (this.state.businesstypeid == 0) {
            this.setState({ businesstypeerror: true })
        }
        if (this.state.countryid == 0) {
            this.setState({ countryerror: true })
        }
        if (this.state.stateid == 0) {

            this.setState({ stateerror: true })
        }
        if (this.state.cityid == 0) {
            this.setState({ cityerror: true })
        }

        if (mobile == true && gmail == true && pinCode == true && this.state.businesstypeid != 0 && this.state.countryid != 0 && this.state.stateid != 0 && this.state.cityid != 0) {
            this.setState({ locd: true })
            let token = await AsyncStorage.getItem("jwtoken")
            const formData = new FormData();
            formData.append("Id", this.state.busID)
            formData.append("Name", this.state.companyname)
            formData.append("Description", 'Description')
            formData.append("Address", this.state.address)
            formData.append("Address2", 'tag')
            formData.append("CityId", this.state.cityid)
            formData.append("StateID", this.state.stateid)
            formData.append("CountryID", this.state.countryid)
            formData.append("PinCode", this.state.pincode)
            formData.append("Phone", this.state.Mobileno)
            formData.append("Email", this.state.Email)
            formData.append("BusinessTypeId", this.state.businesstypeid)
            formData.append("IsActive", true)
            formData.append("TimeZoneId", 37)
            formData.append("WebSite", this.state.website)
            formData.append("GSTNNo", this.state.gstNum)
            formData.append("Latitude", this.state.Latitude)
            formData.append("Longitude", this.state.Longitude)
            formData.append("FileToUpload", this.state.photo == null ? this.state.profilDP : {
                uri: this.state.photo[0].uri,
                type: this.state.photo[0].type,
                name: this.state.photo[0].fileName,
            })
            console.log(formData, "dkoskokskok..........");
            await axios.post(basesUrl + "v1/Businesses/AddEditBusinessByUser", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            }).then((re) => {
                this.setState({ photo: null })
                AsyncStorage.setItem("businessId", re.data.data.toString());
                this.props.navigation.navigate("Home")
            })
        }
    }

    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View style={{ height: "100%", backgroundColor: '#EDEDF4' }}>
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
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    backgroundColor: 'transparent',
                                    paddingHorizontal: 50,

                                }}>
                                    <View style={{
                                        borderRadius: 10,
                                        backgroundColor: "white",
                                        width: '100%', height: 'auto', padding: 20,
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
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000' }}>Delete predefined responses</Text>
                                            {/* <Pressable
                                    onPress={() => this.setState({ modalVisiblesp: false })}
                                >
                                    <Image
                                        source={require('../Assets/ico-close.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                                </Pressable> */}
                                        </View>
                                        <View style={{}}>
                                            {
                                                this.state.seatingBox.map((item) =>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#707070' }}>
                                                        <Text style={{ fontFamily: item.delete == true ? "OpenSans-SemiBoldItalic" : 'OpenSans-SemiBold', fontSize: 18, color: item.delete == true ? '#A5A5A5' : '#000000', textDecorationLine: item.delete == true ? 'line-through' : 'none' }}>{item.inputValue}</Text>
                                                        <Pressable
                                                            onPress={() => this.removeTextInput(item)}
                                                        >
                                                            {
                                                                item.delete == true ? (<Image
                                                                    source={require('../Assets/ico-undo.png')}
                                                                    style={{ width: 16, height: 20 }}
                                                                />) : (<Image
                                                                    source={require('../Assets/delete.png')}
                                                                    style={{ width: 20, height: 30 }}
                                                                />)
                                                            }

                                                        </Pressable>
                                                    </View>
                                                )
                                            }
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 45 }}>
                                            <Pressable
                                                onPress={() => this.setState({ modalVisiblesp: false })}
                                            >
                                                <Text style={{ fontSize: 20, color: '#C6C6C6', fontFamily: 'OpenSans-Bold' }}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.saveseating()}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 25 }}>
                                                <Text style={{ fontSize: 20, color: '#fffff', fontFamily: 'Poppins-SemiBold' }}>Save</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modalVisiblesp1}
                                onRequestClose={() => {
                                    this.setState({ modalVisiblesp1: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: '#000000',
                                    opacity: 0.85,
                                    paddingHorizontal: 50
                                }}>
                                    <View style={{
                                        borderRadius: 10,
                                        backgroundColor: "white",
                                        width: '100%', height: 'auto', padding: 10
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 20 }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 24, color: '#000000' }}>Time List</Text>
                                            <Pressable
                                                onPress={() => this.setState({ modalVisiblesp1: false })}
                                            >
                                                <Image
                                                    source={require('../Assets/ico-close.png')}
                                                    style={{ width: 30, height: 30 }}
                                                />
                                            </Pressable>
                                        </View>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                                            {
                                                this.state.timeBox.map((item) =>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, paddingVertical: 10, borderRadius: 10, paddingHorizontal: 20, marginTop: 10, backgroundColor: '#EDEDF4' }}>
                                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 18, color: '#000000' }}>{item}</Text>
                                                        <Pressable
                                                            onPress={() => this.removeTextInput1()}
                                                        >
                                                            <Image
                                                                source={require('../Assets/ico-delete.png')}
                                                                style={{ width: 46, height: 46 }}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modalVisiblesp2}
                                onRequestClose={() => {
                                    this.setState({ modalVisiblesp2: false });
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: '#000000',
                                    opacity: 0.85,
                                    paddingHorizontal: 50
                                }}>
                                    <View style={{
                                        borderRadius: 10,
                                        backgroundColor: "white",
                                        width: '100%', height: 'auto', padding: 10
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 20 }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 24, color: '#000000' }}>Guest List</Text>
                                            <Pressable
                                                onPress={() => this.setState({ modalVisiblesp2: false })}
                                            >
                                                <Image
                                                    source={require('../Assets/ico-close.png')}
                                                    style={{ width: 30, height: 30 }}
                                                />
                                            </Pressable>
                                        </View>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                                            {
                                                this.state.guestBox.map((item) =>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, paddingVertical: 10, borderRadius: 10, paddingHorizontal: 20, marginTop: 10, backgroundColor: '#EDEDF4' }}>
                                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 18, color: '#000000' }}>{item}</Text>
                                                        <Pressable
                                                            onPress={() => this.removeTextInput2()}
                                                        >
                                                            <Image
                                                                source={require('../Assets/ico-delete.png')}
                                                                style={{ width: 46, height: 46 }}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <KeyboardAvoidingView behavior='padding'>
                                <View style={{ backgroundColor: '#000000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, paddingTop: Platform.OS == "ios" ? 50 : 15, }}>
                                    <Pressable
                                        onPress={() => this.props.navigation.navigate("Navbar")}
                                    >
                                        <Image
                                            source={require('../Assets/hamburger.png')}
                                            style={{ width: 36, height: 36 }}
                                        />
                                    </Pressable>
                                    <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 18 : 24, fontFamily: 'Poppins-Medium' }}>Business Information</Text>
                                    <Pressable
                                        onPress={() => this.props.navigation.navigate("Home")}
                                        style={{ backgroundColor: '#067655', paddingHorizontal: this.state.width < 769 ? 15 : 21, paddingVertical: 5, borderRadius: 127 }}
                                    >
                                        <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 14 : 16, fontFamily: 'Poppins-Medium' }}>Basic</Text>
                                        {/* <Image
                            source={require('../Assets/small-sb-logo.png')}
                            style={{ width: 50, height: 51 }}
                        /> */}
                                    </Pressable>
                                </View>
                                <View style={{ backgroundColor: '#EDEDF4', padding: 27, height: this.state.width < 769 && Platform.OS == "android" ? "87.5%" : this.state.width < 769 && Platform.OS == "ios" ? "84%" : "88%", paddingHorizontal: this.state.width < 769 ? 10 : 20, paddingTop: 40 }}>
                                    <ScrollView
                                        style={{ backgroundColor: 'white', borderRadius: 10, padding: 15, paddingHorizontal: this.state.width < 769 ? 10 : 26, marginTop: -10 }}>
                                        <View >
                                            <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                                                {
                                                    this.state.profile == "" ? (this.state.image == null ? <Image
                                                        // source={{ uri: "http://apiwaitlist.nubiz.co.in/" +this.state.image }}
                                                        source={require('../Assets/small-sb-logo.png')}
                                                        style={{ width: this.state.width < 769 ? 97 : 163, height: this.state.width < 769 ? 98 : 165, borderRadius: 127 }}
                                                    /> : <Image
                                                        source={{ uri: "http://apiwaitlist.nubiz.co.in/" + this.state.image }}
                                                        // source={require('../Assets/small-sb-logo.png')}
                                                        style={{ width: this.state.width < 769 ? 97 : 163, height: this.state.width < 769 ? 98 : 165, borderRadius: 127 }}
                                                    />) : (<Image
                                                        source={{ uri: this.state.profile }}
                                                        style={{ width: this.state.width < 769 ? 97 : 163, height: this.state.width < 769 ? 98 : 163, borderRadius: 127 }}
                                                    />)
                                                }

                                                <TouchableOpacity
                                                    onPress={() => this.setState({ modaladd: true })}
                                                >
                                                    <Image
                                                        source={require('../Assets/Ico-AddPhoto.png')}
                                                        style={{ width: this.state.width < 769 ? 30 : 46, height: this.state.width < 769 ? 30 : 46, marginTop: this.state.width < 769 ? -15 : -25 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Dropdown
                                                style={{
                                                    height: 50,
                                                    borderColor: 'gray',
                                                    borderWidth: 0.5,
                                                    borderRadius: 8,
                                                    paddingHorizontal: 8,
                                                    marginTop: Platform.OS == "ios" ? 10 : 0
                                                }}
                                                placeholderStyle={{ fontSize: 16, }}
                                                selectedTextStyle={{ fontSize: 16, }}
                                                inputSearchStyle={{
                                                    height: 40,
                                                    fontSize: 16,
                                                }}
                                                iconStyle={{
                                                    width: 20,
                                                    height: 20,
                                                }}
                                                data={this.state.businessType}
                                                search
                                                maxHeight={300}
                                                labelField="name"
                                                valueField="id"
                                                placeholder={this.state.defaultbusinesstypevalue}
                                                searchPlaceholder="Search..."
                                                value={this.state.businesstypeid}
                                                disable={this.state.disdropdowntype}
                                                onChange={item => {
                                                    this.setState({ businesstypeid: item.id }, () => {
                                                        console.log(this.state.businesstypeid, "okbusinesstype");
                                                    });
                                                    this.setState({ businesstypeerror: false })
                                                }}
                                            />
                                            {/* <View style={{ alignItems: 'center', borderWidth: 1, borderColor: '#C4C4C4', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, width: "100%", paddingVertical: 1, borderRadius: 7 }}>
                                <SelectDropdown
                                    data={this.state.businessType}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem.id, index)
                                        this.setState({ businesstypeid: selectedItem.id, businesstypeerror: false })
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem.name
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item.name
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
                                    // defaultValue={this.state.businesstypeid}
                                    defaultButtonText={this.state.defaultbusinesstypevalue}
                                    buttonTextStyle={{ fontSize: this.state.width < 769 ? 20 : 24, fontFamily: "Poppins-Regular", color: "#2A2539", textAlign: "left" }}
                                    buttonStyle={{ backgroundColor: 'white', fontSize: this.state.width < 769 ? 20 : 24, fontFamily: "Poppins-Regular", width: "100%", height: this.state.width < 769 ? 50 : 60, }}
                                />
                            </View> */}
                                            {
                                                this.state.businesstypeerror == true ? (<Text style={{ color: 'red' }}>Select Any Business Type</Text>) : null
                                            }
                                            <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between", marginTop: "2%" }}>
                                                <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Business Information</Text>
                                                <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                            </View>
                                            <View style={{ marginBottom: 26 }}>
                                                <View style={{ width: '100%' }}>
                                                    <View style={{ marginTop: 15, }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EDEDF4', borderRadius: 7, width: '100%', paddingHorizontal: 8, paddingVertical: 8 }}>
                                                            <TextInput style={{ marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: "100%" }} placeholder="GST Number" placeholderTextColor={"black"} value={this.state.gstNum} onChangeText={(text) => this.checkGst(text)} maxLength={15} />
                                                            {
                                                                this.state.showCorrectgst == true ? (<Image
                                                                    source={require('../Assets/Iconawesome-check-circle.png')}
                                                                    style={{ width: this.state.width < 769 ? 19 : 28, height: this.state.width < 769 ? 19 : 28, }}
                                                                />) : null
                                                            }

                                                        </View>
                                                        {
                                                            this.state.gsterror == true ? (<Text style={{ color: 'red' }}>Enter Valid Gst No</Text>) : null
                                                        }
                                                    </View>
                                                    <View style={{ marginBottom: 26 }}>
                                                        <View style={{ width: '100%' }}>
                                                            <View style={{ flexDirection: this.state.width < 769 ? "column" : 'row', width: "100%" }}>
                                                                <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%" }}>
                                                                    <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                        <TextInput style={{ marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder="Business Name" placeholderTextColor={"black"} value={this.state.companyname} onChangeText={(text) => this.setState({ companyname: text })} />
                                                                    </View>
                                                                </View>
                                                                <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%", marginLeft: this.state.width < 769 ? 0 : 23 }}>
                                                                    <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                        <TextInput style={{ marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder="Website" placeholderTextColor={"black"} value={this.state.website} onChangeText={(text) => this.setState({ website: text })} />
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: this.state.width < 769 ? "column" : 'row', width: "100%" }}>
                                                                <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%" }}>
                                                                    <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                        <TextInput style={{ marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder="Mobile Number" placeholderTextColor={"black"} value={this.state.Mobileno} onChangeText={(text) => this.setState({ Mobileno: text, mobileerror: false })} maxLength={10} />
                                                                    </View>
                                                                    {
                                                                        this.state.mobileerror == true ? (<Text style={{ color: 'red' }}>Enter Valid Mobile No.</Text>) : null
                                                                    }
                                                                </View>
                                                                <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%", marginLeft: this.state.width < 769 ? 0 : 23 }}>
                                                                    <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                        <TextInput style={{ marginLeft: 8, fontSize: this.state.width < 769 ? 20 : 24, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder=" Email ID" placeholderTextColor={"black"} value={this.state.Email} onChangeText={(text) => this.setState({ Email: text, emailerror: false })} />
                                                                    </View>
                                                                    {
                                                                        this.state.emailerror == true ? (<Text style={{ color: 'red' }}>Enter Valid Email Id</Text>) : null
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Pressable
                                                        onPress={() => this.requestLocationPermission()}
                                                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#41A800', marginTop: 15, paddingHorizontal: 30, paddingVertical: 13, borderRadius: 60, marginBottom: 0, width: "100%", justifyContent: 'center' }}>
                                                        <Image
                                                            source={require('../Assets/Iconmaterial-my-location.png')}
                                                            style={{ width: 19, height: 19, marginLeft: 10 }}
                                                        />
                                                        <Text style={{ color: 'white', fontSize: 20, fontFamily: 'OpenSans-SemiBold', marginLeft: 10 }}>Use Current location</Text>
                                                    </Pressable>
                                                    <View style={{ flexDirection: this.state.width < 769 ? "column" : 'row', width: "100%" }}>
                                                        <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%" }}>
                                                            <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                <TextInput style={{ marginLeft: 8, fontSize: 20, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder="Address" placeholderTextColor={"black"} value={this.state.address} onChangeText={(text) => this.setState({ address: text })} />
                                                            </View>
                                                        </View>
                                                        <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%", marginLeft: this.state.width < 769 ? 0 : 23 }}>
                                                            <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                <TextInput style={{ marginLeft: 8, fontSize: 20, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder="Floor" placeholderTextColor={"black"} value={this.state.floor} onChangeText={(text) => this.setState({ floor: text })} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: this.state.width < 769 ? "column" : 'row', width: "100%", justifyContent: this.state.width < 769 ? null : "space-between" }}>
                                                        <View style={{ width: this.state.width < 769 ? "auto" : "48.5%" }}>
                                                            <Dropdown
                                                                style={{
                                                                    height: 50,
                                                                    borderColor: 'gray',
                                                                    borderWidth: 0.5,
                                                                    borderRadius: 8,
                                                                    paddingHorizontal: 8, marginTop: 10,
                                                                }}
                                                                placeholderStyle={{ fontSize: 16, }}
                                                                selectedTextStyle={{ fontSize: 16, }}
                                                                inputSearchStyle={{
                                                                    height: 40,
                                                                    fontSize: 16,
                                                                }}
                                                                iconStyle={{
                                                                    width: 20,
                                                                    height: 20,
                                                                }}
                                                                data={this.state.countrylist}
                                                                search
                                                                maxHeight={300}
                                                                labelField="name"
                                                                valueField="id"
                                                                placeholder={this.state.defaultcountryname}
                                                                searchPlaceholder="Search..."
                                                                value={this.state.countryid}
                                                                onChange={item => this.callNewfu(item)}
                                                            />

                                                            {
                                                                this.state.countryerror == true ? (<Text style={{ color: 'red' }}>Select Country</Text>) : null
                                                            }
                                                        </View>
                                                        <View style={{ width: this.state.width < 769 ? "auto" : "48.5%" }}>
                                                            <Dropdown
                                                                style={{
                                                                    height: 50,
                                                                    borderColor: 'gray',
                                                                    borderWidth: 0.5,
                                                                    borderRadius: 8,
                                                                    paddingHorizontal: 8, marginTop: 10,
                                                                }}
                                                                placeholderStyle={{ fontSize: 16, }}
                                                                selectedTextStyle={{ fontSize: 16, }}
                                                                inputSearchStyle={{
                                                                    height: 40,
                                                                    fontSize: 16,
                                                                }}
                                                                iconStyle={{
                                                                    width: 20,
                                                                    height: 20,
                                                                }}
                                                                data={this.state.statelist}
                                                                search
                                                                maxHeight={300}
                                                                labelField="name"
                                                                valueField="id"
                                                                placeholder={this.state.defaultstatename}
                                                                searchPlaceholder="Search..."
                                                                value={this.state.stateid}
                                                                onChange={item => this.callstate(item)}
                                                            />

                                                            {
                                                                this.state.stateerror == true ? (<Text style={{ color: 'red' }}>Select State</Text>) : null
                                                            }
                                                        </View>
                                                    </View>

                                                    <View style={{ flexDirection: this.state.width < 769 ? "column" : 'row', width: "100%" }}>
                                                        <View style={{ width: this.state.width < 769 ? "auto" : "48.5%" }}>
                                                            <Dropdown
                                                                style={{
                                                                    height: 50,
                                                                    borderColor: 'gray',
                                                                    borderWidth: 0.5,
                                                                    borderRadius: 8,
                                                                    paddingHorizontal: 8, marginTop: 10,
                                                                }}
                                                                placeholderStyle={{ fontSize: 16, }}
                                                                selectedTextStyle={{ fontSize: 16, }}
                                                                inputSearchStyle={{
                                                                    height: 40,
                                                                    fontSize: 16,
                                                                }}
                                                                iconStyle={{
                                                                    width: 20,
                                                                    height: 20,
                                                                }}
                                                                data={this.state.citylist}
                                                                search
                                                                maxHeight={300}
                                                                labelField="name"
                                                                valueField="id"
                                                                placeholder={this.state.defaultcityname}
                                                                searchPlaceholder="Search..."
                                                                value={this.state.cityid}
                                                                onChange={item => {
                                                                    this.setState({ cityid: item.id }, () => {
                                                                        console.log(this.state.cityid, "okCity");
                                                                    });
                                                                    this.setState({ cityerror: false })
                                                                }}
                                                            />

                                                            {
                                                                this.state.cityerror == true ? (<Text style={{ color: 'red' }}>Select City</Text>) : null
                                                            }
                                                        </View>
                                                        <View style={{ marginTop: 15, width: this.state.width < 769 ? "100%" : "48%", marginLeft: this.state.width < 769 ? 0 : 23 }}>
                                                            <View style={{ backgroundColor: '#EDEDF4', borderRadius: 7, width: "100%", paddingHorizontal: 8, paddingVertical: 8 }}>
                                                                <TextInput style={{ marginLeft: 8, fontSize: 20, color: '#000000', fontFamily: 'OpenSans-Regular', padding: 0, width: this.state.width < 769 ? "100%" : "100%" }} placeholder="Pin Code" placeholderTextColor={"black"} value={this.state.pincode} onChangeText={(text) => this.setState({ pincode: text, pincodeerror: false })} maxLength={6} keyboardType="numeric" />
                                                            </View>
                                                            {
                                                                this.state.pincodeerror == true ? (<Text style={{ color: 'red' }}>Enter Valid Pin Code</Text>) : null
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </KeyboardAvoidingView>
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
                            <Pressable
                                onPress={() => this.submitinfo()}
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
                                style={{
                                    height: 300,
                                    paddingTop: 20
                                }}

                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    backgroundColor: 'rgba(0,0,0,0.7)',


                                }}>
                                    <View style={{
                                        borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                        backgroundColor: "white",
                                        width: '100%', height: 'auto', padding: 20, paddingBottom: 20,
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
                                            <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: 18, color: '#000000' }}>Upload Photo</Text>
                                            <Pressable
                                                onPress={() => this.setState({ modaladd: false })}
                                            // style={{backgroundColor:'#C6C6C6', borderRadius:127, width:45, justifyContent:'center', alignItems:'center', paddingVertical:10}}
                                            >
                                                <Image
                                                    source={require('../Assets/ico-close.png')}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                            </Pressable>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Pressable
                                                onPress={() => this.requestCameraPermission()}
                                            >
                                                <View

                                                    style={{ backgroundColor: '#C6C6C6', borderRadius: 127, width: 60, justifyContent: 'center', alignItems: 'center', height: 60 }}
                                                >
                                                    <Image
                                                        source={require('../Assets/Iconawesome-camera.png')}
                                                        style={{ width: 20, height: 20 }}
                                                    />
                                                </View>
                                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 14, color: '#000000', marginTop: 5 }}>Camera</Text>
                                            </Pressable>
                                            <View style={{ marginLeft: 30, }}>
                                                <Pressable
                                                    onPress={() => this.handleChoosePhoto()}
                                                    style={{ backgroundColor: '#C6C6C6', borderRadius: 127, width: 60, justifyContent: 'center', alignItems: 'center', height: 60 }}
                                                >
                                                    <Image
                                                        source={require('../Assets/Path423.png')}
                                                        style={{ width: 20, height: 20 }}
                                                    />
                                                </Pressable>
                                                <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 14, color: '#000000', marginLeft: 5, marginTop: 5 }}>Gallery</Text>
                                            </View>
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
                                                source={require('../Assets/locationp.png')}
                                                style={{ width: 34, height: 34, marginTop: 0, }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Your current location</Text>
                                            <View style={{ marginTop: 5 }}>
                                                <Text>Latitude: {this.state.Latitude}</Text>
                                                <Text>Longitude: {this.state.Longitude}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                                            <Pressable
                                                onPress={() => this.setState({ loc: false })}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 15 }}
                                            >
                                                <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'OpenSans-Bold' }}>OK</Text>
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