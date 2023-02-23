import { Text, View, SafeAreaView, KeyboardAvoidingView, Dimensions, Image, Pressable, Platform, Modal, ActivityIndicator, BackHandler } from 'react-native'
import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { basesUrl } from '../../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InternetCheck from "../InternetConnection/InternetCheck";
import NetInfo from "@react-native-community/netinfo";


export class Notification extends Component {


    NetInfoSubscribtion = null;

    constructor(props) {
        super(props);
        this.state = {
            width: "",
            onScrollValve: false,
            pageNumber: 1,
            notificationList: [],
            totalPages: "",
            loader: true,
            newNotification: "",
            confirmationMessage: false,
            notificationId: "",
            connection_status: false,
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.NetInfoSubscribtion = NetInfo.addEventListener(
            this._handleConnectivityChange,
        );
        let width = Dimensions.get("screen").width;
        this.setState({ width: width });
        this.getNotificationList();
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

    getNotificationList = async () => {
        let token = await AsyncStorage.getItem("jwtoken");
        let businessesId = await AsyncStorage.getItem("businessId")
        await axios.get(basesUrl + "v1/Notification/GetNotificationList?bussinessID=" + businessesId + "&pageNo=" + this.state.pageNumber + "&pageSize=11", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((response) => {
            console.log("user Response", JSON.stringify(response.data.data.data));
            this.setState({
                notificationList: [...this.state.notificationList, ...response.data.data.data],
                totalPages: response.data.data.totalPages,
                loader: false
            })
        })
    }

    onRead = async (data) => {
        let token = await AsyncStorage.getItem("jwtoken");
        await axios.get(basesUrl + "v1/Notification/ReadNotification?id=" + data.item.id, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((response) => {
            console.log("on read", response.data);
            if (response.data.succeeded == true) {
                this.setState({
                    notificationList: [],
                    pageNumber: 1
                }, () => {
                    this.getNotificationList()
                })
            }
        })
    }


    onScroll = () => {
        if (this.state.pageNumber < this.state.totalPages) {
            this.setState({
                pageNumber: this.state.pageNumber + 1,
            }, () => {
                this.getNotificationList();
            })
        }
    }

    getSendTime = (data) => {
        let d1 = data.item.sendDate;
        let d2 = new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        if (d1 == d2) {
            return data.item.sendTime
        } else {
            return data.item.sendDate
        }
    }


    confirmationMessageModal = (data) => {
        this.setState({
            confirmationMessage: true,
            notificationId: data.item.id
        })
    }

    deleteConfirmNotification = async () => {
        let token = await AsyncStorage.getItem("jwtoken");
        await axios.get(basesUrl + "v1/Notification/DeleteNotification?id=" + this.state.notificationId, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        }).then((response) => {
            console.log("on read", response.data);
            if (response.data.succeeded == true) {
                this.setState({
                    notificationList: [],
                    pageNumber: 1,
                    confirmationMessage: false
                }, () => {
                    this.getNotificationList()
                })
            }
        })
    }

    render() {
        return (
            <View>
                {
                    this.state.connection_status ?
                        <View>
                            {
                                this.state.loader ?
                                    <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                                        <ActivityIndicator size={"large"} />
                                    </View> :
                                    <KeyboardAvoidingView>
                                        <View style={{ backgroundColor: '#000000', paddingHorizontal: this.state.width < 769 ? 10 : 30 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Platform.OS == "ios" ? 5 : 5, marginTop: Platform.OS == "ios" && this.state.width < 769 ? "10%" : 0, padding: "2%" }}>
                                                <Pressable
                                                    onPress={() => this.props.navigation.navigate("Home")}
                                                >
                                                    <Image
                                                        source={require('../Assets/icon-back-01.png')}
                                                        style={{ width: this.state.width < 769 ? 24 : 40, height: this.state.width < 769 ? 12 : 20, marginTop: 0, }}
                                                        resizeMode={"contain"}
                                                    />
                                                </Pressable>
                                                <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 23 : 30, fontFamily: 'Poppins-Medium' }}>Notification</Text>
                                                <View
                                                // onPress={() => this.props.navigation.navigate("")}
                                                >
                                                    {/* <Image
                                            source={require('../Assets/ico-search-mobile.png')}
                                            style={{ width: this.state.width < 769 ? 24 : 40, height: this.state.width < 769 ? 20 : 20, marginTop: 0, }}
                                            resizeMode={"contain"}
                                        /> */}
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ padding: "5%", backgroundColor: "#EDEDF4", height: "97%" }}>
                                            <View style={{ backgroundColor: "white", height: this.state.width < 769 ? Platform.OS == "android" ? "79%" : "72%" : "80%", borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                                                {
                                                    this.state.notificationList == 0 ?
                                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                            <Text style={{ color: '#ffffff', fontSize: this.state.width < 769 ? 15 : 30, fontFamily: 'Poppins-Medium' }}>No Notification</Text>
                                                        </View> :
                                                        <SwipeListView
                                                            data={this.state.notificationList}
                                                            showsVerticalScrollIndicator={false}
                                                            onScrollEndDrag={() => this.onScroll()}
                                                            renderItem={(data, rowMap, index) => (
                                                                <Pressable key={data.item.id} onPress={() => this.onRead(data)}>
                                                                    <View style={{ backgroundColor: "white", padding: "3%", height: this.state.width < 769 ? 70 : 100, borderTopLeftRadius: data.index == 0 ? 10 : 0, borderTopRightRadius: data.index == 0 ? 10 : 0, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                                                            {/* "#00FF6D" : "#FF0000" : "transparent" */}
                                                                            <View style={{ borderColor: (data.item.notificationType == 1 || data.item.notificationType == 3) && data.item.isRead == false ? "#00FF6D" : data.item.notificationType == 2 && data.item.isRead == false ? "#FF0000" : "transparent", width: this.state.width < 769 ? 35 : 40, height: this.state.width < 769 ? 35 : 40, borderRadius: 30, alignItems: "center", justifyContent: "center", borderWidth: 1 }}>
                                                                                <View style={{ backgroundColor: data.item.notificationType == 1 || data.item.notificationType == 3 ? "#067655" : "#B30808", width: this.state.width < 769 ? 30 : 35, height: this.state.width < 769 ? 30 : 35, borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                                                                                    <Image
                                                                                        source={data.item.notificationType == 1 && require('../Assets/tableReserved.png') || data.item.notificationType == 2 && require('../Assets/tableCancel.png') || data.item.notificationType == 3 && require('../Assets/tableConfirm.png')}
                                                                                        style={{ width: this.state.width < 769 ? 15 : 20, height: this.state.width < 769 ? 15 : 20 }}
                                                                                        resizeMode={"contain"}
                                                                                    />
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ marginLeft: "2%", display: "flex", flexDirection: this.state.width < 769 ? "column" : "row", justifyContent: "space-between", width: this.state.width < 769 ? "68%" : "92%", alignSelf: "center" }}>
                                                                                <View style={{ width: this.state.width < 769 ? "100%" : "40%", display: "flex", flexDirection: this.state.width < 769 ? "row" : "column" }}>
                                                                                    <Text style={{ color: "#000000", fontFamily: data.item.isRead == false ? 'OpenSans-Bold' : "OpenSans-Medium", fontSize: this.state.width < 769 ? 12 : 20 }}>{data.item.name}</Text>
                                                                                    <Text style={{ color: "#000000", fontFamily: data.item.isRead == false ? 'OpenSans-Bold' : "OpenSans-Medium", fontSize: this.state.width < 769 ? 12 : 20 }}> ({data.item.contactNo})</Text>
                                                                                </View>
                                                                                <View style={{ width: this.state.width < 769 ? "100%" : "30%" }}>
                                                                                    <Text style={{ fontSize: this.state.width < 769 ? 12 : 18, color: "#959595", fontFamily: data.item.isRead == false ? 'OpenSans-Bold' : "OpenSans-Medium", marginTop: this.state.width < 769 ? "1%" : 0 }}>{data.item.msgText}</Text>
                                                                                </View>
                                                                                {
                                                                                    this.state.width < 769 ? null : <Text style={{ fontSize: this.state.width < 769 ? 14 : 18, color: "#959595", fontFamily: data.item.isRead == false ? 'OpenSans-Bold' : "OpenSans-Medium" }}>{this.getSendTime(data)}</Text>
                                                                                }
                                                                            </View>
                                                                        </View>
                                                                        {
                                                                            this.state.width < 769 ?
                                                                                <View style={{ paddingBottom: "5%" }}>
                                                                                    <Text style={{ fontSize: this.state.width < 769 ? 12 : 14, color: "#959595", fontFamily: data.item.isRead == false ? 'OpenSans-Bold' : "OpenSans-Medium" }}>{this.getSendTime(data)}</Text>
                                                                                </View> : null
                                                                        }
                                                                    </View>
                                                                    <View style={{ flex: 1, borderWidth: 0.5, borderColor: '#EDEDF4', width: this.state.width < 769 ? "84%" : "88%", alignSelf: "flex-end" }}></View>
                                                                </Pressable>
                                                            )}
                                                            renderHiddenItem={(data, rowMap, index) => {
                                                                return (
                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
                                                                        <View></View>
                                                                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                                                            <Pressable
                                                                                onPress={() => this.confirmationMessageModal(data)}
                                                                                style={{ backgroundColor: "#B30808", height: this.state.width < 769 ? 70 : 100, width: this.state.width < 769 ? 70 : 80, alignItems: "center", justifyContent: "center", marginRight: "0.5%" }}>
                                                                                <Image
                                                                                    source={require('../Assets/notificationDelete.png')}
                                                                                    style={{ width: this.state.width < 769 ? 15 : 40, height: this.state.width < 769 ? 18 : 22 }}
                                                                                    resizeMode={"contain"}
                                                                                />
                                                                            </Pressable>
                                                                            <Pressable
                                                                                onPress={() => {
                                                                                    AsyncStorage.setItem("businessWaitlistId", data.item.businessWaitlistId.toString());
                                                                                    if (data.item.notificationType == 1 && data.item.actionPerformed == false) {
                                                                                        this.props.navigation.navigate("WaitTime")
                                                                                    }
                                                                                }}
                                                                                style={{ backgroundColor: data.item.notificationType == 1 && data.item.actionPerformed == false ? "#067655"  : "gray", height: this.state.width < 769 ? 70 : 100, width: this.state.width < 769 ? 70 : 80, alignItems: "center", justifyContent: "center", borderTopRightRadius: data.index == 0 ? 10 : 0 }}>
                                                                                <Image
                                                                                    source={require('../Assets/notificationEdit.png')}
                                                                                    style={{ width: this.state.width < 769 ? 17 : 40, height: this.state.width < 769 ? 17 : 20 }}
                                                                                    resizeMode={"contain"}
                                                                                />
                                                                            </Pressable>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            }}
                                                            disableRightSwipe={true}
                                                            leftOpenValue={0}
                                                            rightOpenValue={this.state.width < 769 ? -145 : -172}
                                                        />
                                                }
                                            </View>
                                        </View>
                                    </KeyboardAvoidingView>
                            }
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.confirmationMessage}
                                onRequestClose={() => {
                                    this.setState({ confirmationMessage: false });
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
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 18, color: '#000000', textAlign: 'center', textAlignVertical: 'center', alignItems: 'center' }}>Are you sure to Delete ?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                onPress={() => this.deleteConfirmNotification()}
                                                style={{ backgroundColor: '#41A800', borderRadius: 60, paddingVertical: 5, paddingHorizontal: 20 }}>
                                                <Text style={{ fontSize: 18, color: '#ffff', fontFamily: 'OpenSans-Bold' }}>Yes</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => this.setState({ confirmationMessage: false })}
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

export default Notification