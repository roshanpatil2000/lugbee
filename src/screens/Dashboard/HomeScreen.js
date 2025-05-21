import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, StatusBar, BackHandler, Platform, ToastAndroid, Image } from 'react-native'
import { commonTextStyle, fonts, LargeTextStyle, MediumTextStyle, primaryColorBackground, smallTextSize } from '../../styles/CommonStyling'
import { BubbleTopToBottom } from '../../assets/svg/splash/SplashSvgs'
import { AppName, Loader } from '../../components/custom/CustomFields'
import { colors } from '../../styles/color'
import { BagSvg, CalenderSvg, LocationPinSvg, LuggageSvg } from '../../assets/svg/basic/basiciconSvg'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { getAddressByLatLng, getCurrentLatLng } from '../../constants/GeoLocation'
import moment from 'moment'
import { getFormatTime } from '../../constants/TimeConst'
import { searchStore } from '../../store/actions/StoreAction'
import { AppConst } from '../../constants/AppConst'
import CalenderModal from '../../components/Modals/CalenderModal'
import StoreList from '../../components/stores/StoreList'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import GooglePlaceSearchModal from '../../components/Modals/GooglePlaceSearchModal'
import StoreSearchView from '../../components/Dashboard/StoreSearchView'
import Toast from 'react-native-toast-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'
import { SearchDetailType, setUserDetailType } from '../../store/types'
import { getUserProfile } from '../../store/actions/UserAction'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetRefProps } from '../../components/Dashboard/BottomSheet'
import { useCallback } from 'react'
import { useRef } from 'react'
import { screenHeight, screenWidth } from '../../styles/ResponsiveLayout'
import { SafeAreaCustomView } from '../../styles/SafeAreaCustomView'
import { getPromotionalBanners, setIsHome } from '../../store/actions/AppAction'
import { NoStoreSvg } from '../../assets/svg/Home/NoStoreSvg'
import { useNavigationState } from '@react-navigation/native'
import BannerModal from '../../components/Modals/BannerModal'
import analytics, { firebase } from "@react-native-firebase/analytics"
import PromotionalBanners from '../../components/Dashboard/PromotionalBanners'


const HomeScreen = ({ navigation }) => {
    const [date, setDate] = useState({ from: null, to: null })
    const [bagsCounter, setBagsCounter] = useState(1)
    const [activity, setActivity] = useState(false);
    const [address, setAddress] = useState({});
    const [stores, setStores] = useState(null);
    const [apiCall, setApiCall] = useState(true);
    const [showCalender, setShowCalender] = useState(false);
    const [selectAdrs, setSelectAdrs] = useState(false);
    const [toCalender, setToCalender] = useState(false);
    const [adBanner, setAdBanner] = useState([]);
    const isHome = useSelector(state => state.app.isHome)
    const dispatch = useDispatch();
    const ref = useRef()


    useEffect(() => {

        // bannerAnalytics();

        getPromotionalBanners().then(res => {
            if (res?.status == 200) {
                setAdBanner(res.data);
            }
        })
        if (apiCall) {
            if (AppConst.accessToken) {
                dispatch(getUserProfile(address));
            }
            getCoords()
        }
    }, []);

    useEffect(() => {
        navigation.addListener("focus", () => {
            let time = getFormatTime();
            setDate(time);
            dispatch(setIsHome(true));
            if (!isHome) {
            }
        });
    }, [navigation]);

    useEffect(() => {
        if (toCalender) {
            setShowCalender({ key: "To", type: "to" })
        }
    }, [toCalender]);
    console.log("Api Call--", apiCall)

    useEffect(() => {
        if (apiCall && date && date.from && address && address.lat) {
            setApiCall(false);
            getStoreListFunc("location").then(() => {
                if (AppConst.accessToken) {
                    dispatch(getUserProfile(address));
                }
            })
        }
    }, [date, address, apiCall]);



    const getStoreListFunc = (type) => {
        if (!address || !address?.lat) {
            Toast.show({
                type: "error",
                position: "top",
                text1: "Please select your location",
            });
            return;
        }
        setActivity(true);
        let searchData = {
            bags: bagsCounter,
            lat: address.lat,
            lng: address.lng,
            timeZone: "Asia/Kolkata",
            page: 0,
            fromDate: date.from.date,
            fromTime: date.from.time,
            toDate: date.to.date,
            toTime: date.to.time,
            addressName: address.address,
            city: address.city,
            address
        }
        return searchStore(searchData).then(res => {
            setActivity(false);
            if (res?.status === 200) {
                // AppConst.showConsoleLog(type)
                setStores({ type: type, data: res.data });
                dispatch({
                    type: SearchDetailType,
                    payload: searchData
                });
            }
            else if (res.status == 204) {
                AppConst.showConsoleLog(res)
                setStores({ type: type, data: [] });
                // alert(res.message)
            } else if (res.status == 400) {
                let time = getFormatTime();
                AppConst.showConsoleLog("next time--", time)
                setDate(time);
            } else {
                setStores({ type: type, data: [] });
            }
            return res;
        })
    }


    const getCoords = () => {
        setActivity(true);
        getCurrentLatLng(false, (res) => {
            setActivity(false);
            console.log('Lat Long response', res);
            if (res) {
                const coord = {
                    latitude: res.lat,
                    longitude: res.lng,
                }
                getAddressByApi(res.lat, res.lng);
            } else {
                // dispatch(getUserProfile(address));
                setApiCall(false)
            }
        })
        // setActivity(false);
    }


    const getAddressByApi = async (lat, lng) => {
        // setActivity(true);
        const addrs = await getAddressByLatLng({ lat, lng });
        if (addrs) {
            console.log('addrs---', addrs);
            setAddress({
                address: addrs.address.city + ", " + addrs.address.state + ", " + addrs.address.country,
                lat: lat,
                lng: lng,
                city: addrs.address.city,
                country: addrs.address.country,
                formatted_address: addrs.formatted_address,
            });

        }
    }


    const bannerAnalytics = async () => {
        try {
            // await analytics().logEvent('banner_click', {
            //     user_id: 1
            // }).then(res => {
            //     console.log("log: ", res)
            // })
            // ...
            // await firebase.analytics().setAnalyticsCollectionEnabled(true);
            // let fId = await firebase.analytics().getAppInstanceId()
            // console.log("app id: ", fId)
            // await analytics().logEvent('basket', {
            //     id: 3745092,
            //     item: 'mens grey t-shirt',
            //     description: ['round neck', 'long sleeved'],
            //     size: 'L',
            // }).then(res => {
            //     console.log("log: ", res)
            // })


            let an = await analytics().logScreenView({
                screen_name: "homeScreen"
            });
            console.log("analytics---", an);
            // await analytics().logAppOpen();
        } catch (error) {
            AppConst.showConsoleLog(error)
        }
    }

    AppConst.showConsoleLog("AppConst--   ", AppConst.deviceToken);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {adBanner?.length > 0 && adBanner[0].image_url && !AppConst.accessToken ?
                    <PromotionalBanners
                        banners={adBanner}
                    />
                    : null
                }
                <View style={{ flex: 1, width: "100%" }}>
                    <StoreSearchView
                        getCoords={getCoords}
                        setAddress={setAddress}
                        setShowCalender={setShowCalender}
                        setBagsCounter={setBagsCounter}
                        setDate={setDate}
                        address={address}
                        setSelectAdrs={setSelectAdrs}
                        date={date}
                        bagsCounter={bagsCounter}
                        getStoreListFunc={() => getStoreListFunc(address.city ? address.city : address.address ? address.address : "search")}
                    />
                </View>

                {stores && stores.type && stores ?
                    <BottomSheet
                        ref={ref}
                        headerText={stores?.type == "location" ? `Found ${stores.data.length ? stores.data.length : 0} Lugbee stores around you` : `Found ${stores.data.length ? stores.data.length : 0} Lugbee stores`}
                        banner={adBanner?.length > 0 && adBanner[0].image_url && !AppConst.accessToken}
                    >
                        <View style={{ flex: 1, }}>
                            <View style={{ flex: 1, width: "100%", backgroundColor: colors.white }}>
                                {stores && stores.data?.length > 0 ?
                                    // <View style={{}}>
                                    <StoreList
                                        list={stores.data}
                                    />
                                    // </View>
                                    :
                                    stores && stores.data?.length == 0 ?
                                        <View style={{ flex: 1, }}>
                                            <Text style={{ ...smallTextSize, textAlign: "center", color: colors.primary, marginVertical: 15, maxWidth: screenWidth - 100, alignSelf: "center" }}>Oops! There are no luggage storage here. Please change the location.</Text>
                                            <NoStoreSvg scale={0.9} />
                                        </View>
                                        : null
                                }
                            </View>
                        </View>
                    </BottomSheet> : null}
            </View>


            {Platform.OS !== 'ios' ? (
                <ExecuteOnlyOnAndroid navigation={navigation} message={"tap back again to exit the App"} />
            ) : (
                <></>
            )}

            {showCalender &&
                <CalenderModal
                    close={() => {
                        setShowCalender(false)
                        if (showCalender.type == "to" && toCalender) {
                            setToCalender(false)
                        }
                    }}
                    selectedDate={showCalender.type === "from" ? date.from.date : date.to.date}
                    type={showCalender.key}
                    isTimePicker={true}
                    minTime={showCalender.type === "from" ?
                        { hour: date.from.time.split(":")[0], min: date.from.time.split(":")[1] }
                        : { hour: date.from.time.split(":")[0], min: date.from.time.split(":")[1] }
                    }
                    // from={{date:date.from.date,time:date.from.time}}
                    minDate={showCalender.type === "from" ? null : (date.from.time.split(":")[0] >= 23 ? moment(date.from.date, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD") : date.from.date)}
                    onDaySelect={(d) => {
                        if (showCalender.type === "from") {
                            setDate({
                                ...date,
                                from: {
                                    time: d.time,
                                    date: d.date,
                                    formatted: moment(d.date + " " + d.time, "YYYY-MM-DD HH:mm").format("MMM,DD HH:mm")
                                },
                                to: {
                                    ...date.to,
                                    time: moment(d.time, "HH:mm").add(1, "hour").format("HH:mm"),
                                    date: moment(d.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                    formatted: moment(d.date + " " + d.time, "YYYY-MM-DD HH:mm").add(1, 'hour').format("MMM,DD HH:mm")
                                }
                            })
                            setToCalender(true);
                            // setShowCalender({ type: "to", key: "To" });
                        } else {
                            setDate({
                                ...date,
                                to: {
                                    time: d.time,
                                    date: d.date,
                                    formatted: moment(d.date + " " + d.time, "YYYY-MM-DD HH:mm").format("MMM,DD HH:mm")
                                }
                            })
                            setToCalender(false);
                        }
                        setShowCalender(false);
                    }}
                />
            }

            {activity && <Loader />}
        </GestureHandlerRootView>
    );
};



export const ExecuteOnlyOnAndroid = (props) => {
    const { message, navigation } = props;
    const [exitApp, setExitApp] = useState(0);
    // const routesLength = useNavigationState(state => state.routes.length);
    const backAction = () => {
        if (navigation.canGoBack()) {
            return false;
        }
        AppConst.showConsoleLog("exitApp", exitApp);
        setTimeout(() => {
            setExitApp(0);
        }, 2000); // 2 seconds to tap second-time

        if (exitApp === 0) {
            setExitApp(exitApp + 1);

            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else if (exitApp === 1) {
            BackHandler.exitApp();
        }
        return true;
    };
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    });
    return <></>;
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    button: {
        height: 50,
        borderRadius: 25,
        aspectRatio: 1,
        backgroundColor: 'white',
        opacity: 0.6,
    },
    title: {
        ...MediumTextStyle,
        color: colors.white,
        // fontWeight: "600"
    },
    dateview: {
        flexDirection: 'row',
        width: "50%",
        alignItems: 'center',
        justifyContent: "space-evenly"
    },
    myLocation: {
        padding: 5,
        borderWidth: 0.5,
        borderColor: colors.grey,
        borderRadius: 20,
        marginLeft: 5
    },
    timeTxt: {
        ...commonTextStyle,
        fontFamily: fonts.medium
    },
    goBtn: {
        width: "50%",
        backgroundColor: colors.secondary,
        borderBottomRightRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    bannerImg: {
        height: 145,
        width: screenWidth - 40,
        resizeMode: "stretch",
        alignSelf: "center",
        borderRadius: 15,
        marginTop: 0
    }
})
export default HomeScreen
