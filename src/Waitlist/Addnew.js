import { Dimensions, Pressable, Text, View, Image, ScrollView, TouchableOpacity, BackHandler, KeyboardAvoidingView, Modal, Platform } from 'react-native'
import React, { Component } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { basesUrl } from '../../App';
import { checkPhone, normalAZtext } from '../Validation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";

export default class Addnew extends Component {
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
      guest1: [
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
      customeValueCheck: false,
      error: false
    }
    this.updateIndex = this.updateIndex.bind(this)
  }
  componentDidMount = async () => {
    this.props.navigation.addListener('focus', async () => {
      let ss = await AsyncStorage.getItem("businessId")
      this.setState({ businessId: ss })
    });
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    let deviceWidth = Dimensions.get("screen").width
    this.setState({ width: deviceWidth })
    let ss = await AsyncStorage.getItem("businessId")
    this.setState({ busId: ss }, () => console.log(this.state.busId, "soal"))
    this.getseatingactivelist();
    this.getAddi()
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

  getAddi = async () => {
    let token = await AsyncStorage.getItem("jwtoken")
    let buseinssId = this.state.busId
    await axios.get(basesUrl + "v1/BusinessWaitlist/GetWaitlistForm?businessId=" + buseinssId, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json'
      }
    }).then((re) => {
      console.log("Add new data", re.data.data)
      this.setState({ noteShow: re.data.data.notes })
      this.setState({ tableShow: re.data.data.tableNo })
      let statusValue = false;
      for (i = 0; i < re.data.data.waitListFormOthers.length; i++) {
        if (re.data.data.waitListFormOthers[i].isActive == true) {
          statusValue = true;
        }
      }
      if (re.data.data.waitListFormOthers.length != 0) {
        this.setState({
          custome: re.data.data.waitListFormOthers,
          customeValueCheck: statusValue
        })
        console.log(re.data.data.waitListFormOthers, "oppppp");
        let newCus = this.state.lastCustome;
        re.data.data.waitListFormOthers.map((item) => {
          if (item.isActive == true) {
            let data = {
              "id": 0,
              "waitListFormOtherId": item.id,
              "formValue": ""
            }
            console.log(data, "djjso");
            newCus.push(data)
          }
        })
        console.log("newCus", newCus);
        this.setState({ lastCustome: newCus })
      }
    })
    console.log("slopa", this.state.lastCustome);
  }

  checkvist = async (text) => {
    let phone = checkPhone(text)
    console.log(text.length);
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
        console.log(re.data, "pre")
        if (re.data.data != null) {
          this.setState({ vistlist: re.data.data })
          this.setState({ customerId: re.data.data.id }, () => console.log("sss", this.state.customerId))
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
      console.log(re.data.data, "area list")
      this.setState({ areaList: re.data.data })
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

  guest = (i, item) => {
    let selectUnselectitem = this.state.guest.map((item, index) => {
      if (i == index) {
        item.selected = true;
        this.setState({ guestNo: 0 }, () => console.log("sjsasklskajsselect", this.state.guestNo))
        this.setState({ guestDone: true })
        this.setState({ guestCheck: item.exptime }, () => console.log("select", this.state.guestCheck))
        this.setState({ adult: item.exptime })
        this.setState({ kids: 0 })
        this.setState({ disable: 0 })
      }
      else {
        item.selected = false
      }
      return { ...item }
    })

    this.setState({ guest: selectUnselectitem })

  }

  guestText = (text) => {
    this.setState({ guestCheck: 0 }, () => console.log("wipoieoiiwselect", this.state.guestCheck))
    this.setState({ guestDone: true })
    this.guest(this.state.guest.length + 1)
    const data = text.replace(/[ `@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/~]/gi, '')
    this.setState({ guestNo: data }, () => console.log("type", this.state.adult))
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
      this.setState({ kids: this.state.kids + 1 }, () => console.log("kids", this.state.kids))
      this.setState({ adult: this.state.adult - 1 })
    } else if (this.state.disable != 0) {
      this.setState({ kids: this.state.kids + 1 }, () => console.log("disable", this.state.disable))
      this.setState({ disable: this.state.disable - 1 })
    }
  }

  disableguest = () => {
    if (this.state.adult != 0) {
      this.setState({ disable: this.state.disable + 1 }, () => console.log("disable", this.state.disable))
      this.setState({ adult: this.state.adult - 1 })
    } else if (this.state.kids != 0) {
      this.setState({ disable: this.state.disable + 1 }, () => console.log("disable", this.state.disable))
      this.setState({ kids: this.state.kids - 1 })
    }
  }


  adultguest = () => {
    if (this.state.kids != 0) {
      console.log(this.state.kids, "uuuu");
      this.setState({ kids: this.state.kids - 1 }, () => console.log(this.state.kids, "afterselect kids"))
      this.setState({ adult: this.state.adult + 1 }, () => console.log(this.state.adult, "afterselect adult"))
    } else if (this.state.disable != 0) {
      console.log(this.state.disable, "uuuu000000");
      this.setState({ disable: this.state.disable - 1 }, () => console.log(this.state.disable, "afterselect disable"))
      this.setState({ adult: this.state.adult + 1 }, () => console.log(this.state.adult, "afterselect adult"))
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


  submit = async () => {
    if (this.state.busId != 0) {
      let phones = checkPhone(this.state.phone)
      console.log(phones, "checkphone");
      let names = normalAZtext(this.state.customerName)
      console.log("checkName", names);
      if (names == false) {
        this.setState({ customnameerror: true })
      }
      if (this.state.phone != "") {
        if (phones == false) {
          this.setState({ customephoneerror: true })
        }
      } else {
        this.setState({ phonempty: true })
      }
      let time = new Date()
      time.setHours(time.getHours() + 5)
      time = new Date(time)
      time.setMinutes(time.getMinutes() + 30)
      if (this.state.guestCheck == "" && this.state.guestNo == "") {
        this.setState({ guestDone: false })
      }
      if (this.state.reservation == false) {
        if (this.state.expadd == "" && this.state.exptimes == "") {
          this.setState({ waittimeselect: false })
        }
        if (this.state.guestDone == true && names == true && phones == true && this.state.waittimeselect == true) {
          let newArray = this.state.prefArray
          this.state.areaList.map((itemss, index) => {
            if (itemss.isDeleted == true) {
              let data = {
                "businessesSeatingsId": itemss.id
              }
              newArray.push(data)
            }
          })
          console.log(newArray, "Prederrd");
          this.setState({ prefArray: newArray })
          let otherValue = this.state.lastCustome
          let valll = []
          otherValue.map((req) => {
            console.log(req.formValue.length, "lenght");
            if (req.formValue.length != 0) {
              valll.push(req)
            }
          })
          console.log("okkoko", valll);

          let data = {
            "id": 0,
            "businessesId": this.state.busId,
            "contactNo": this.state.phone,
            "name": this.state.customerName,
            "customerId": this.state.customerId,
            "groupSize": this.state.guestNo == 0 ? parseInt(this.state.guestCheck) : this.state.guestNo,
            "adults": this.state.adult,
            "children": this.state.kids,
            "divyang": this.state.disable,
            "status": 0,
            "notes": this.state.Notes,
            "waitTime": this.state.exptimes == 0 ? this.state.expadd : this.state.exptimes,
            "isReservation": this.state.reservation,
            "reservation": this.state.reservation == true ? new Date(new Date(this.state.datess).getFullYear() + "-" + (new Date(this.state.datess).getMonth() + 1) + "-" + new Date(this.state.datess).getDate() + "T" + (new Date(this.state.gettime).getHours() <= 9 ? "0" + new Date(this.state.gettime).getHours() : new Date(this.state.gettime).getHours()) + ":" + new Date(this.state.gettime).getMinutes() + ":" + (new Date(this.state.gettime).getSeconds() <= 9 ? "0" + new Date(this.state.gettime).getSeconds() : new Date(this.state.gettime).getSeconds()) + "." + new Date(this.state.gettime).getMilliseconds() + "Z").toJSON() : new Date(time),
            "tableNoValue": this.state.table,
            "businessWaitlistSeating": this.state.prefArray,
            "businessWaitlistOther": valll,
          }
          console.log(data.businessWaitlistOther, "waitlist without res1");
          let token = await AsyncStorage.getItem("jwtoken")
          console.log(token, "token");

          await axios.post(basesUrl + "v1/BusinessWaitlist/AddEditBusinessWaitlistCommand", data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json-patch+json'
            }
          }).then((re) => {
            console.log(re.data, "prescdcscdcscsdc")
            this.setState({ prefArray: [] })
            if (re.data.succeeded != true) {
              this.setState({ loc: true })
              this.setState({ apierrormessage: re.data.message })
              console.log("Message", re.data.message);
            } else {
              this.setState({ apisuccessstatus: true, registerSuccess: true, shotim: false })
              this.setState({ apierrormessage: re.data.message })
              console.log("Message", re.data.message);
              setTimeout(() => {
                this.props.navigation.goBack("Home")
                this.setState({ apisuccessstatus: false, registerSuccess: false })
                this.setState({ apierrormessage: "" })
              }, 1000)
            }
          })
        }
      }
      else {
        this.setState({ lastDatepost: new Date(this.state.datess).getFullYear() + "-" + (new Date(this.state.datess).getMonth() + 1) + "-" + new Date(this.state.datess).getDate() + "T" + (new Date(this.state.gettime).getHours() <= 9 ? "0" + new Date(this.state.gettime).getHours() : new Date(this.state.gettime).getHours()) + ":" + new Date(this.state.gettime).getMinutes() + ":" + (new Date(this.state.gettime).getSeconds() <= 9 ? "0" + new Date(this.state.gettime).getSeconds() : new Date(this.state.gettime).getSeconds()) + "." + new Date(this.state.gettime).getMilliseconds() + "Z" }, () => console.log(this.state.lastDatepost, "okpppppppppppppppppppppp"))
        console.log(new Date(this.state.gettime), "khshjjhj");
        console.log(new Date(this.state.datess), "reservation dates");
        let datavalid = false;
        if (new Date(this.state.datess).getDate() != new Date(this.state.gettime).getDate()) {
          datavalid = true
        } else if (new Date(this.state.datess).getDate() == new Date(this.state.gettime).getDate()) {
          if (new Date().getHours() != new Date(this.state.gettime).getHours()) {
            datavalid = true
          } else {
            datavalid = false
          }
        }
        if (datavalid == true && this.state.shotim == true) {
          if (this.state.guestDone == true && names == true && phones == true) {
            let newArray = this.state.prefArray
            this.state.areaList.map((itemss, index) => {
              if (itemss.isDeleted == true) {
                let data = {
                  "businessesSeatingsId": itemss.id
                }
                newArray.push(data)
              }
            })
            console.log(newArray, "Prederrd");
            this.setState({ prefArray: newArray })
            let otherValue = this.state.lastCustome
            let valll = []
            otherValue.map((req) => {
              console.log(req.formValue.length, "lenght");
              if (req.formValue.length != 0) {
                valll.push(req)
              }
            })
            let data = {
              "id": 0,
              "businessesId": this.state.busId,
              "contactNo": this.state.phone,
              "name": this.state.customerName,
              "customerId": this.state.customerId,
              "groupSize": this.state.guestNo == 0 ? parseInt(this.state.guestCheck) : this.state.guestNo,
              "adults": this.state.adult,
              "children": this.state.kids,
              "divyang": this.state.disable,
              "status": 0,
              "notes": this.state.Notes,
              "waitTime": this.state.exptimes == 0 ? this.state.expadd : this.state.exptimes,
              "isReservation": this.state.reservation,
              "reservation": this.state.reservation == true ? new Date(new Date(this.state.datess).getFullYear() + "-" + (new Date(this.state.datess).getMonth() + 1) + "-" + new Date(this.state.datess).getDate() + "T" + (new Date(this.state.gettime).getHours() <= 9 ? "0" + new Date(this.state.gettime).getHours() : new Date(this.state.gettime).getHours()) + ":" + new Date(this.state.gettime).getMinutes() + ":" + (new Date(this.state.gettime).getSeconds() <= 9 ? "0" + new Date(this.state.gettime).getSeconds() : new Date(this.state.gettime).getSeconds()) + "." + new Date(this.state.gettime).getMilliseconds() + "Z").toJSON() : new Date(time),
              "tableNoValue": this.state.table,
              "businessWaitlistSeating": this.state.prefArray,
              "businessWaitlistOther": this.state.lastCustome
            }
            let token = await AsyncStorage.getItem("jwtoken")
            console.log(token, "token");
            await axios.post(basesUrl + "v1/BusinessWaitlist/AddEditBusinessWaitlistCommand", data, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
              }
            }).then((re) => {
              this.setState({ prefArray: [] })
              if (re.data.succeeded != true) {
                this.setState({ loc: true })
                this.setState({ apierrormessage: re.data.message })
                console.log("Message", re.data.message);
              } else {
                this.setState({ apisuccessstatus: true, registerSuccess: true })
                this.setState({ apierrormessage: re.data.message })
                console.log("Message", re.data.message);
                setTimeout(() => {
                  this.props.navigation.goBack("Home")
                  this.setState({ apisuccessstatus: false, registerSuccess: false })
                  this.setState({ apierrormessage: "" })
                }, 1000)
              }

            })
          } else {
            console.log("time not equal");
          }
        } else {
          this.setState({ selectTime: true })
          this.setState({ modaladds: true });
        }

      }
    } else {
      this.setState({ modaladd: true })
    }
  }

  customef = (text, item) => {
    let textValidation = /^[ A-Za-z0-9_@.$,]*$/;
    if (text.match(textValidation) || text.length == 0) {
      this.state.lastCustome.map((value) => {
        if (value.waitListFormOtherId == item.id) {
          value.formValue = text
        }
        return { ...value }
      })
      console.log("maek", this.state.lastCustome);
      this.setState({
        error: false
      })
    } else {
      this.setState({
        error: true
      })
    }
  }

  render() {
    return (
      <View>
        {
          this.state.connection_status ?
            <View style={{ height: "100%", backgroundColor: '#EDEDF4', }}>
              <KeyboardAvoidingView behavior={Platform.OS == "ios" ? 'padding' : ''}>
                <View>
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
                            onPress={() => {
                              this.setState({ loc: false })
                              this.props.navigation.navigate("Home")
                            }}
                            style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 15 }}
                          >
                            <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'OpenSans-Bold' }}>OK</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Modal>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modaladds}
                    onRequestClose={() => {
                      this.setState({ modaladds: false });
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
                            style={{ width: 24, height: 24, marginTop: 0, }}
                          />
                          <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Please Select Valid Time</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                          <Pressable
                            onPress={() => this.setState({ modaladds: false })}
                            style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 15 }}
                          >
                            <Text style={{ fontSize: 15, color: '#C6C6C6', fontFamily: 'OpenSans-Bold' }}>Ok</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Modal>
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
                        <Text style={{ color: '#ffffff', fontSize: 24, fontFamily: 'Poppins-Medium' }}>Add New</Text>
                        <View>
                        </View>
                      </View>
                      <View style={{ marginLeft: -13 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                          <Pressable
                            onPress={() => this.walk()}
                            style={{ width: "47%", backgroundColor: this.state.walkIn == true ? '#067655' : "#0000", alignItems: 'center', paddingVertical: 10, borderRadius: 7 }}
                          >
                            <Text style={{ color: "#ffff", opacity: this.state.walkIn == true ? 1 : 0.7, fontFamily: 'Poppins-Medium', fontSize: this.state.width < 769 ? 15 : 24, marginTop: this.state.width < 769 ? 0 : 5 }}>Walk In</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => this.reserv()}
                            style={{ width: "47%", backgroundColor: this.state.reservation == true ? '#067655' : "#0000", alignItems: 'center', paddingVertical: 10, borderRadius: 7 }}
                          >
                            <Text style={{ color: "#ffff", opacity: this.state.reservation == true ? 1 : 0.7, fontFamily: 'Poppins-Medium', fontSize: this.state.width < 769 ? 15 : 24, marginTop: this.state.width < 769 ? 0 : 5 }}>Reservation</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                    <View style={{
                      height: this.state.width < 769 ? "77.5%" : "81%", margin: this.state.width < 769 ? 10 : 20, backgroundColor: 'white', borderRadius: 10
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
                                  value={this.state.phone}
                                  onChangeText={(text) => { this.setState({ phone: text, customephoneerror: false, phonempty: false }), this.checkvist(text) }}
                                  keyboardType="number-pad"
                                  selectionColor={'#067655'}
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
                                  value={this.state.customerName}
                                  maxLength={30}
                                  editable={this.state.vistlist != null || this.state.phone == "" ? false : true}
                                  selectionColor={'#067655'}
                                  onChangeText={(text) => this.setState({ customerName: text, customnameerror: false })}
                                  style={{ backgroundColor: '#EDEDF4', borderRadius: 7, fontSize: this.state.width < 769 ? 16 : 24, fontFamily: 'Poppins-Regular', height: this.state.width < 769 ? 45 : 60, padding: 0, paddingHorizontal: 15, width: this.state.width < 769 ? '100%' : "100%", color: '#000000', marginTop: this.state.width < 769 ? 10 : 0, marginLeft: this.state.width < 769 ? 0 : 20 }}
                                />
                                {
                                  this.state.customnameerror == true ? (<View style={{ backgroundColor: "#FF0000", padding: 5, borderRadius: 5, marginTop: 2, marginLeft: this.state.width < 769 ? 0 : 20, width: this.state.width < 769 ? "100%" : "100%" }}>
                                    <Text style={{ color: 'white' }}>Name is required</Text>
                                  </View>) : null
                                }
                              </View>
                            </View>
                            <Text style={{ color: '#000000', fontSize: 16, fontFamily: 'OpenSans-SemiBold', marginTop: 10, marginLeft: this.state.width < 769 ? 0 : 0 }}>Past Visits: <Text style={{ color: "#067655" }}>{this.state.vistlist == null ? "--" : this.state.vistlist.visits}</Text> | Last Visit: <Text style={{ color: "#067655" }}>{this.state.vistlist == null ? "--" : this.state.vistlist.lastVisit == null ? "No Last Vist" : this.state.vistlist.lastVisit}</Text></Text>
                            {
                              this.state.reservation == true ? (<View style={{ marginTop: 30, marginLeft: this.state.width < 769 ? 0 : 0 }}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                  <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Select Date</Text>
                                  <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                  {/* <View style={{ borderWidth: 1, alignSelf: "center", width: this.state.width < 769 ? "60%" : "75%", borderColor: "#707070", marginLeft: 30, opacity: 0.2 }}></View> */}
                                </View>
                                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                  <Pressable
                                    onPress={() => { this.setState({ closeDate: true }), console.log("dl") }}
                                    style={{ backgroundColor: 'white', padding: 10, borderColor: "#000", borderWidth: 1, width: "49%", justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                                    <Text style={{ color: 'black' }}>{new Date(this.state.datess).toLocaleDateString("en-GB")}</Text>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => { this.setState({ closetime: true, selectTime: false }), console.log("time") }}
                                    style={{ backgroundColor: 'white', padding: 10, borderColor: this.state.selectTime == true ? "red" : "#000", borderWidth: 1, width: "49%", justifyContent: "center", alignItems: 'center', borderRadius: 5, marginLeft: "2%" }}>
                                    <Text style={{ color: 'black' }}>{this.state.shotim == true ? new Date(this.state.gettime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" }) : "--:--"}</Text>
                                  </Pressable>
                                  <View>
                                  </View>
                                  <Text style={{ color: 'black', marginTop: 10 }}>{this.state.showDate}</Text>
                                </View>
                              </View>) : null
                            }
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
                                      <Pressable
                                        onPress={() => this.guest(i, item)}
                                        style={{ backgroundColor: item.selected == true ? "#067655" : '#FFFFFF', borderWidth: item.selected == true ? 0 : 2, borderColor: item.selected == true ? "#067655" : '#000000', borderRadius: 66, width: 60, height: item.id == 9 ? 42 : 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10 }}>
                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', color: item.selected == true ? "#FFFFFF" : '#3B3B3B' }}>{item.exptime}</Text>
                                      </Pressable>
                                    )}

                                  <TextInput
                                    placeholder="Others"
                                    placeholderTextColor={"#3B3B3B"}
                                    value={this.state.guestNo}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    multiline={true}
                                    numberOfLines={1}
                                    blurOnSubmit={true}
                                    selectionColor={'#067655'}
                                    onChangeText={(text) => this.guestText(text)}
                                    style={{ paddingHorizontal: 14, paddingVertical: 0, fontSize: 20, fontFamily: 'OpenSans-Regular', color: '#3B3B3B', width: this.state.width < 769 ? '98%' : '87%', marginLeft: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRadius: 66, height: 38, marginTop: 10 }}
                                  />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 13, justifyContent: "space-between", marginLeft: this.state.width < 769 ? 0 : 45 }}>
                                  <View>
                                    {
                                      this.state.adult != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 29, borderRadius: 15, }}>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{this.state.adult}</Text>
                                      </View>) : null
                                    }
                                    <Pressable
                                      onPress={() => this.adultguest()}
                                    >

                                      {
                                        this.state.adult != 0 ? (<Image
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
                                      this.state.kids != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 29, borderRadius: 15, }}>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{this.state.kids}</Text>
                                      </View>) : null
                                    }
                                    <Pressable
                                      onPress={() => this.kidsguest()}
                                    >

                                      {
                                        this.state.kids != 0 ? (<Image
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
                                      this.state.disable != 0 ? (<View style={{ zIndex: 9999, position: 'absolute', right: 0, top: -10, alignItems: 'center', backgroundColor: 'orange', width: 29, borderRadius: 15, }}>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{this.state.disable}</Text>
                                      </View>) : null
                                    }

                                    <Pressable
                                      onPress={() => this.disableguest()}
                                    >

                                      {
                                        this.state.disable != 0 ? (<Image
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
                              <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Preferred Area</Text>
                                <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                              </View>
                              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: this.state.width < 769 ? -10 : 0 }}>
                                {
                                  this.state.areaList.map((item, i) =>
                                    <Pressable
                                      onPress={() => this.prefArea(i, item)}
                                      style={{ backgroundColor: item.isDeleted == true ? "#067655" : '#FFFFFF', borderWidth: item.isDeleted == true ? 2 : 2, borderColor: item.isDeleted == true ? "#067655" : '#000000', borderRadius: 66, height: 36, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: 10, paddingVertical: 0, paddingVertical: 0, paddingHorizontal: this.state.width < 769 ? 12 : 15, paddingBottom: 4 }}>
                                      <Text style={{ fontSize: this.state.width < 769 ? 12 : 16, fontFamily: 'OpenSans-Regular', color: item.isDeleted == true ? "#FFFFFF" : '#3B3B3B' }}>{item.name}</Text>
                                    </Pressable>
                                  )
                                }
                                {
                                  this.state.noteShow == true ?
                                    <View style={{ marginLeft: this.state.width < 769 ? "2%" : 0, flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: "2%", width: this.state.width < 769 ? "97%" : "100%" }}>
                                      <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Notes</Text>
                                      <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                    </View> : null
                                }
                                {
                                  this.state.noteShow == true ? (
                                    <TextInput
                                      placeholder='Notes'
                                      placeholderTextColor={'#000000'}
                                      value={this.state.Notes}
                                      onChangeText={(text) => this.setState({ Notes: text })}
                                      selectionColor={'#067655'}
                                      maxLength={100}
                                      multiline={true}
                                      style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, height: 90, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 10 : 0 }}
                                    />) : null
                                }
                                {
                                  this.state.tableShow == true ?
                                    <View style={{ flexDirection: 'row', width: this.state.width < 769 ? "97%" : "100%", alignItems: "center", justifyContent: "space-between", marginTop: "2%", marginLeft: this.state.width < 769 ? "3%" : 0 }}>
                                      <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Table No.</Text>
                                      <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                    </View> : null
                                }
                                {
                                  this.state.tableShow == true ? (<TextInput
                                    placeholder='Enter Table Number'
                                    placeholderTextColor={'#000000'}
                                    value={this.state.table}
                                    maxLength={3}
                                    onChangeText={(text) => this.setState({ table: text })}
                                    keyboardType="numeric"
                                    selectionColor={'#067655'}
                                    style={{ color: '#000000', backgroundColor: '#EDEDF4', borderRadius: 7, width: this.state.width < 769 ? "100%" : '100%', marginTop: 10, height: 52, textAlignVertical: 'top', paddingLeft: 20, fontSize: 20, fontFamily: 'OpenSans-Regular', marginLeft: this.state.width < 769 ? 10 : 0 }}
                                  />) : null
                                }
                              </View>
                            </View>
                            <View>
                              {
                                this.state.walkIn == true ? (<View>
                                  <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", marginTop: "5%", justifyContent: "space-between" }}>
                                    {
                                      this.state.waittimeselect == false ? (<Image
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
                                      placeholder="Others "
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
                              {
                                this.state.custome.length !== 0 && this.state.customeValueCheck == true ? (
                                  <View style={{ marginTop: "5%", marginLeft: this.state.width < 769 ? 0 : 0 }}>
                                    <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                      <Text style={{ color: '#3B3B3B', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>Custom Fields</Text>
                                      <View style={{ flex: 1, borderWidth: 1, borderColor: '#707070', marginLeft: "2%" }}></View>
                                    </View>
                                    {
                                      this.state.custome.map((item, i) => {
                                        if (item.isActive == true) {
                                          return (
                                            <TextInput
                                              placeholder={item.name}
                                              placeholderTextColor={'#000000'}
                                              // value={this.state.cusValue}
                                              onChangeText={(text) => this.customef(text, item)}
                                              selectionColor={'#067655'}
                                              maxLength={60}
                                              multiline={true}
                                              style={{ backgroundColor: '#EDEDF4', borderRadius: 7, fontSize: this.state.width < 769 ? 16 : 20, fontFamily: 'Poppins-Regular', height: this.state.width < 769 ? 45 : 60, padding: 0, paddingHorizontal: 15, width: this.state.width < 769 ? '100%' : "100%", color: '#000000', marginTop: 10 }}
                                            />
                                          )
                                        }

                                      }
                                      )
                                    }
                                    {
                                      this.state.error == false ? null :
                                        <Text style={{ color: "red", fontFamily: "OpenSans-SemiBold" }}>Allows only special character _@,$. and alphnumeric values.</Text>
                                    }
                                  </View>) : null
                              }

                            </View>

                            {/* {
                this.state.width < 769 ? (<View style={{ height: Platform.OS == "ios" ? 220 : 200 }}>
                </View>) : null
              } */}

                          </View>
                        </ScrollView>
                      </KeyboardAvoidingView>
                    </View>
                    {/* {
            this.state.closeDate == true ? ( */}
                    <DateTimePickerModal
                      testID="dateTimePicker"
                      isVisible={this.state.closeDate}
                      value={this.state.datess}
                      mode="date"
                      minimumDate={new Date()}
                      display={Platform.OS == "android" ? "default" : "spinner"}
                      onConfirm={(date) => this.setState({ datess: new Date(date), gettime: new Date(), closeDate: false })}
                      onCancel={() => this.setState({ closeDate: false })}
                    />
                    {/* ) : null
          } */}
                    {/* {
            this.state.closetime == true ? ( */}
                    <DateTimePickerModal
                      testID="dateTimePicker"
                      value={this.state.gettime}
                      isVisible={this.state.closetime}
                      mode="time"
                      is24Hour={true}
                      display={"spinner"}
                      onConfirm={(date) => {
                        console.log(date);
                        this.setState({ shotim: true })
                        if (new Date().getDate() != new Date(this.state.datess).getDate()) {
                          this.setState({ gettime: new Date(date), closetime: false })
                        } else if (new Date(date).getHours() > new Date().getHours()) {
                          console.log("ok");
                          this.setState({ gettime: new Date(date), closetime: false })
                        } else {
                          console.log("fined");
                          this.setState({ closetime: false })
                        }
                      }}
                      onCancel={() => this.setState({ closetime: false })}
                    />
                    {/* ) : null
          } */}
                  </View>
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
                </View>
              </KeyboardAvoidingView>
              <TouchableOpacity
                onPress={() => this.submit()}
                style={{ position: 'absolute', bottom: 0, backgroundColor: '#067655', width: '100%', paddingVertical: 15 }}>
                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'OpenSans-SemiBold' }}>Submit</Text>
              </TouchableOpacity>
            </View> :
            <View>
              <InternetCheck />
            </View>
        }
      </View>
    )
  }
}