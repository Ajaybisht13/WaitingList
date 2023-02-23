import { Text, View, Dimensions, Platform } from 'react-native'
import React, { Component } from 'react'
import Signin from './src/authComponent/Signin'
import Navbar from './src/navBar/Navbar'
import Waitlistform from './src/Waitlist/Waitlistform'
import Home from './src/Dashboard/Home'
import Addnew from './src/Waitlist/Addnew'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
import messaging from "@react-native-firebase/messaging";
import axios from 'axios'
import Companyinfo from './src/Waitlist/Companyinfo'
import Validation from './src/Component/Validation'
import History from './src/Waitlist/History'
import Timing from './src/Waitlist/Timing'
import Settings from './src/Waitlist/Settings';
import Subscription from './src/Waitlist/Subscription';
import Notification from './src/Waitlist/Notification';
import * as NavigationService from './src/NavigationService/NavigationService';
import WaitTime from './src/Waitlist/WaitTime';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator();


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      deviceId: "",
      fcmToken: "",
      os: "",
      deviceManuf: "",
      deviceBrand: "",
      deviceModel: "",
      deviceFingerprint: "",
      oneTime: false,
      width: ""
    }
  }



  componentDidMount = async () => {
    if (Platform.OS == "android") {
      this.getFCMToken();
    } else {
      this.requestUserPermission();
    }
    let width = Dimensions.get("screen").width
    console.log(width, "width");
    this.setState({ width: width })
    this.getNotification()
  }

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.getFCMToken();
    }
  }



  getFCMToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
    this.setState({ fcmToken: token }, () => {
      this.info()
    })
  }

  getNotification = () => {
    messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
      if (remoteMessage) {
        await AsyncStorage.setItem("newMessage", "true")
      }
    });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log("onNotificationOpenedApp: ", JSON.stringify(remoteMessage));
      if (remoteMessage) {
        await AsyncStorage.setItem("newMessage", "true")
      }
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        console.log(
          "Notification caused app to open from quit state:",
          JSON.stringify(remoteMessage)
        );
        if (remoteMessage !== null && remoteMessage.data.pagename !== null) {
          NavigationService.navigate(remoteMessage.data.pagename, {
            dataId: remoteMessage.data.id,
            title: remoteMessage.data.title
          });
        } else {

        }
      });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
  }

  info = () => {
    DeviceInfo.getManufacturer().then((manufacturer) => {
      this.setState({ deviceManuf: manufacturer })
    });
    let brand = DeviceInfo.getBrand();
    this.setState({ deviceBrand: brand })
    let model = DeviceInfo.getModel();
    this.setState({ deviceModel: model })
    DeviceInfo.getFingerprint().then((fingerprint) => {
      this.setState({ deviceFingerprint: fingerprint })
    });
    DeviceInfo.getUniqueId().then((deviceId) => {
      this.setState({ deviceId: deviceId }, () => {
        console.log(this.state.deviceId);
        this.deviceRegistration()
      })
    });
  }

  deviceRegistration = () => {
    let deviceIfo = {
      "deviceID": this.state.deviceId,
      "deviceType": Platform.OS == "android" ? 0 : 1,
      "os": Platform.OS == "android" ? "android" : "ios",
      "manufacture": this.state.deviceManuf,
      "brand": this.state.deviceBrand,
      "model": this.state.deviceModel,
      "fingerPrint": this.state.deviceFingerprint,
      "faceID": "",
      "appVersion": "",
      "fcmToken": this.state.fcmToken
    }
    console.log(deviceIfo);
    axios.post("http://apiwaitlist.nubiz.co.in/api/identity/DeviceRegistration", deviceIfo).then((result) => {

    })
  }



  render() {
    return (
      <NavigationContainer ref={
        NavigationService.navigationRef
      }>
        <Stack.Navigator initialRouteName="Signin">
          <Stack.Screen name="Signin" component={Signin} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Navbar" component={Navbar} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Validation" component={Validation} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Timing" component={Timing} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Waitlistform" component={Waitlistform} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Home" component={Home} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Companyinfo" component={Companyinfo} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Addnew" component={Addnew} options={{
            headerShown: false
          }} />
          <Stack.Screen name="History" component={History} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Settings" component={Settings} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Subscription" component={Subscription} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Notification" component={Notification} options={{
            headerShown: false
          }} />
          <Stack.Screen name="WaitTime" component={WaitTime} options={{
            headerShown: false
          }} />
        </Stack.Navigator>
      </NavigationContainer>
      // <Validation/>
    )
  }
}

export const basesUrl = "http://apiwaitlist.nubiz.co.in/api/"