import { Text, View, Image, SafeAreaView } from 'react-native'
import React, { Component } from 'react'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import AnimatedLottieView from 'lottie-react-native'

export class InternetCheck extends Component {
  render() {
    return (

      <View style={{ backgroundColor: "#EDEDF4", height: "100%", padding: "6%" }}>
        <SafeAreaView>
          <LinearGradient colors={['#FFFFFF', '#E0FFF6', '#E0FFF6']} style={{ borderRadius: 10 }}>
            <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
              {/* <FastImage style={{ height: 200, width: 200 }} source={require("../Assets/internetConnection.png")} resizeMode="contain" /> */}
              <AnimatedLottieView
                source={require("../Assets/internetConnection.json")}
                autoPlay = {true}
                style={{ height: 300 }}
              />
              <Text style={{ fontFamily: "Poppins-SemiBold", color: "black", fontSize: 22, position: "absolute", bottom: "25%" }}>No Internet Connection</Text>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </View>

    )
  }
}

export default InternetCheck