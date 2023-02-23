import React, { Component } from 'react';
import { View, Dimensions, Text, SafeAreaView, BackHandler, Image, TouchableOpacity } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { height } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const overlayColor = "rgba(0,0,0,0.5)";

const rectDimensions = SCREEN_WIDTH * 0.85;
const rectBorderWidth = SCREEN_WIDTH * 0.010;
const rectBorderColor = "#067655";

const scanBarWidth = SCREEN_WIDTH * 0.70;
const scanBarHeight = SCREEN_WIDTH * 0.0035;
const scanBarColor = "#067655";


class Validation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  }



  onSuccess = (e) => {
    this.setState({
      result: e,
      scan: false,
      ScanResult: true
    }, () => {
      AsyncStorage.setItem("qrId", this.state.result.data);
      this.props.navigation.navigate("Home");
    })

  }
  activeQR = () => {
    this.setState({ scan: true })
  }
  scanAgain = () => {
    this.setState({ scan: true, ScanResult: false })
  }

  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18
      },
      to: {
        [translationType]: fromValue
      }
    };
  }

  render() {
    return (
      <SafeAreaView style={{ height: "100%" }}>
        <QRCodeScanner
          showMarker={true}
          ref={(node) => { this.scanner = node }}
          cameraStyle={{ height: "100%" }}
          cameraProps={{
            captureAudio: false,
            flashMode: "auto"
          }}
          onRead={this.onSuccess}
          customMarker={
            <View style={styles.rectangleContainer}>
              <View style={styles.topOverlay}>
                <TouchableOpacity
                  style={{ width: this.state.width < 769 ? 10 : 36, height: this.state.width < 769 ? 10 : 36, textAlign: 'right', alignSelf: 'flex-end', marginTop: Platform.OS == "android" ? 10 : 20, marginRight:"4%" }}
                  onPress={() => this.props.navigation.navigate("Home")}
                >
                  <Image source={require('../Assets/qrCross.png')} style={{ width: "60%", height: '60%' }} onPress={() => this.props.navigation.navigate("Home")} resizeMode = "contain" />
                </TouchableOpacity>
                <Text style={{ fontSize: 23, color: "white", fontFamily: 'OpenSans-SemiBold' }}>
                  Scan Qr Code
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.leftAndRightOverlay} />

                <View style={styles.rectangle}>
                  <Animatable.View
                    style={styles.scanBar}
                    direction="alternate-reverse"
                    iterationCount="infinite"
                    easing="linear"
                    animation={this.makeSlideOutTranslation(
                      "translateY",
                      SCREEN_WIDTH * 0.20
                    )}
                  />
                </View>

                <View style={styles.leftAndRightOverlay} />
              </View>
              <View style={styles.bottomOverlay}>
                <Text style={{ fontSize: 20, color: "white", marginTop: "2%", fontFamily: 'OpenSans-SemiBold' }}>
                  Align Qr Code within frame
                </Text>
                <Text style={{ fontSize: 20, color: "white", fontFamily: 'OpenSans-SemiBold' }}>to scan</Text>
              </View>
              <View style={styles.bottomOverlay} />
            </View>
          }
        />
      </SafeAreaView>
    );
  }
}

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: SCREEN_HEIGHT
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    alignItems: "center"
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.85,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
    borderWidth: 2,
    borderColor: scanBarColor
  }
};

export default Validation;