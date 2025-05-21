import React, { useEffect } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { colors } from '../../styles/color';
import { screenWidth } from '../../styles/ResponsiveLayout';
import { commonTextStyle, fonts, largeMediumStyle, LargeTextStyle, MediumTextStyle, smallTextSize } from '../../styles/CommonStyling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RazorpayCheckout from 'react-native-razorpay';
import { AppConst, RazorpayConst, returnPrice } from '../../constants/AppConst';
import { diffYMDHMS, getFormatTime, getTimeDifference, return12HrFormat } from '../../constants/TimeConst';
import { Button, Checkbox, CustomBackButton, Loader } from '../../components/custom/CustomFields';
import { CoinSvg, LuggageTrolley } from '../../assets/svg/basic/basiciconSvg';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, createCheckOut } from '../../store/actions/StoreAction';
import { useState } from 'react';
import moment from 'moment';
import VerificationModal from '../../components/Modals/VerificationModal';
import PaymentDoneModal from '../../components/Modals/PaymentDoneModal';
import CalenderModal from '../../components/Modals/CalenderModal';
import { goBack, navigate } from '../../route/RootNavigation';
import StoreLandmarkComponent from '../../components/stores/detail/StoreLandmarkComponent';
import { insurancePolicyWebURL } from '../../services/service';
import GoogleRouteMap from '../../components/Modals/GoogleRouteMap';
import StoreServicesAvailable from '../../components/stores/detail/StoreServicesAvailable';
import TimingAndBagsComponent from '../../components/stores/detail/TimingAndBagsComponent';
import BorderImageOverlay from '../../components/stores/detail/BorderImageOverlay';
import StoreWeekTiming from '../../components/stores/detail/StoreWeekTiming';
import LoginAlertModal from '../../components/Modals/LoginAlertModal';
import { getUserProfile } from '../../store/actions/UserAction';

const StoreDetail = ({ route, navigation }) => {
    const { d } = route.params;
    const dispatch = useDispatch();
    const [detail, setDetail] = useState(d);
    const [isCreate, setIsCreate] = useState(true);
    const [loading, setLoading] = useState(false);
    const [verifyModal, setVerifyModal] = useState(null);
    const userReducer = useSelector(state => state.user);
    const [paymentDone, setpaymentDone] = useState(false);
    const [lugbeeCredit, setLugbeeCredit] = useState(1);
    const [showCalender, setShowCalender] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [toCalender, setToCalender] = useState(false);
    const [veiwMapModal, setViewMapModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [storeAvailableTime, setStoreAvailableTime] = useState(false);
    const [searchData, setSearchData] = useState({
        fromDate: userReducer.searchDetail.fromDate,
        fromTime: userReducer.searchDetail.fromTime,
        toDate: userReducer.searchDetail.toDate,
        toTime: userReducer.searchDetail.toTime,
        bags: Number(userReducer.searchDetail.bags)
    });


    useEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <CustomBackButton />
            )
        });

        let currentDate = moment().format('YYYY-MM-DD');
        let currentTime = moment().format("HH:mm");

        // console.log("currentTime", currentDate, searchData.fromDate, currentTime, searchData.fromTime, searchData.fromTime < currentTime);

        if (currentDate == searchData.fromDate && searchData.fromTime < currentTime) {
            goBack();
            Toast.show({
                text1: "Please select valid time",
                type: "error",
            })
        }

        navigation.addListener('focus', () => {
            AppConst.showConsoleLog("detail focus");
            if (AppConst.accessToken && !userReducer?.userDetail) {
                dispatch(getUserProfile(searchData.address));
            } else if (AppConst.accessToken && userReducer?.userDetail) {
                // checkoutFunc()
            }
        });
    }, []);


    // useEffect(() => {
    //     AppConst.showConsoleLog("checkout useEffect-- ")
    //     if (AppConst.accessToken && userReducer?.userDetail) {
    //         checkoutFunc();
    //     }
    // }, [userReducer])

    useEffect(() => {
        if (toCalender) {
            setShowCalender({ type: "to", key: "To" });
            setSearchData(toCalender);
        }
    }, [toCalender])

    useEffect(() => {
        if (AppConst.accessToken && userReducer?.userDetail) {
            checkoutFunc();
            return;
        }

    }, [lugbeeCredit, searchData, userReducer]);


    const checkoutFunc = () => {
        setLoading(true);
        createCheckOut({
            ...userReducer.searchDetail,
            storeId: detail.id,
            ...userReducer.userDetail,
            lugbeeCredit: detail.checkout?.lugbee_credits == 0 ? 0 : lugbeeCredit,
            ...searchData
        }, isCreate ? false : true).then(res => {
            setLoading(false);
            console.log("res data----", res.data);
            if (res?.status == 200) {
                setDetail({ ...detail, checkout: res.data });
            }
            setIsCreate(false);
        });
    }
    // console.log("currentTime", userReducer);

    const checkUserVerfification = () => {


        if (!AppConst.accessToken) {
            setLoginModal(true);
            return;
        }

        if (!userReducer?.userDetail) {
            return;
        }
        // AppConst.showConsoleLog("Access Token :-> ", AppConst.accessToken, userReducer);
        // return;
        if (!userReducer.userDetail?.email_id_isverify) {
            setVerifyModal("Email");
            return
        }
        if (!userReducer.userDetail?.mobile_no_isverify) {
            setVerifyModal("Mobile");
            return
        }

        if (!userReducer?.userDetail?.first_name || !userReducer?.userDetail?.last_name) {
            setVerifyModal("Name");
            return
        }

        let currentDate = moment().format('YYYY-MM-DD');
        let currentTime = moment().format("HH:mm");


        if (currentDate == searchData.fromDate && searchData.fromTime < currentTime) {
            goBack();
            Toast.show({
                text1: "Please select valid time",
                type: "error",
            })
        }


        // return;
        // makePaymeant({
        //     amount: "5000",
        //     order_id: "1234567",
        //     pay_currency: "INR",
        //     return_url: ""
        // });
        // return;
        setLoading(true);
        createBooking(detail.id, detail.host_id, bookingId).then((res) => {
            setLoading(false);
            if (res) {
                setBookingId(res.data.booking_data.id);
                let data = {
                    amount: (res.data.transaction_data.order_amount * 100).toString(),
                    pay_currency: res.data.transaction_data.pay_currency,
                    return_url: res.data.transaction_data.return_url,
                    order_id: res.data.transaction_data.trans_ref,
                    razorpayKey: res.data.transaction_data.app_id
                }
                if (res.data.transaction_data.razorpay) {
                    makePaymeant(data);
                } else {
                    setpaymentDone({
                        paymentId: "direct_pay",
                        signature: "lugbee_sign",
                        orderId: res.data.transaction_data.order_id,
                        type: "lugbee_credits",
                    });
                }
            }
        })
    }

    const makePaymeant = (data) => {
        var options = {
            description: `Pay to ${detail.name}`,
            // image: 'https://i.imgur.com/3g7nmJC.png',
            currency: data.pay_currency,
            key: RazorpayConst.key, // Your api key
            order_id: data.order_id,
            // callback_url: data.return_url,
            amount: data.amount,     // in paise
            name: RazorpayConst.name,
            prefill: {
                email: userReducer.userDetail?.email_id ? userReducer.userDetail?.email_id : "",//userReducer.userDetail?.email_id,
                contact: userReducer.userDetail?.mobile_no,
                name: userReducer.userDetail.first_name ? userReducer.userDetail.first_name + " " + userReducer.userDetail.last_name ? userReducer.userDetail.last_name : "" : ''
            },
            theme: { color: colors.primary },
        }
        AppConst.showConsoleLog("options", options);
        RazorpayCheckout.open({ ...options }).then((data) => {
            // handle success
            console.log("data", data, data.razorpay_signature);
            setpaymentDone({
                paymentId: data.razorpay_payment_id,
                signature: data.razorpay_signature,
                orderId: data.razorpay_order_id,
                type: "lugbee_credits"
            });
            // alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            console.log("error", error);
            alert(`Error: ${error}`);
        });
    }

    const differenceTxt = () => {
        let t = getTimeDifference(searchData.fromDate + ", " + searchData.fromTime, searchData.toDate + ", " + searchData.toTime);

        let str = "";
        if (t.months > 0) {
            str += t.months + `${t.months > 1 ? " months" : " month"} `;
        }
        if (t.days > 0) {
            str += t.days + `${t.days > 1 ? " days" : " day"} `
        }
        if (t.hours > 0) {
            str += t.hours + `${t.hours > 1 ? " hours" : " hour"} `
        }
        if (t.minutes > 0) {
            str += `${t.minutes} minutes`
        }
        return str;
    }

    const policyPress = () => {
        Linking.openURL(insurancePolicyWebURL);
    }

    // console.log(lugbeeCredit);

    return (
        <View style={styles.container}>
            <ScrollView style={{ flexGrow: 1 }}>

                <BorderImageOverlay
                    images={detail?.profile_image_path_list}
                    detail={detail}
                    addressName={userReducer.searchDetail.addressName}
                />
                <View style={styles.detailContainer}>

                    <View style={{ flexDirection: "row", paddingHorizontal: 20, justifyContent: "space-around" }}>
                        <TouchableOpacity style={[styles.rw, { paddingVertical: 0 }]} onPress={() => setStoreAvailableTime(true)}>
                            <MaterialIcons name="access-time" size={25} color={colors.primary} />
                            <Text style={styles.rwTxt}>MON-SUN</Text>
                            <View style={{ alignItems: "center" }}>
                                <Text style={styles.rwSmallTxt}>View timing</Text>
                                <AntDesign name='down' size={15} color={colors.primary} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.rw}>
                            <Text style={[styles.rwTxt, { color: colors.green, fontSize: 18 }]}>{returnPrice(detail.rate)}</Text>
                            <Text style={styles.rwTxt}>PRICE</Text>
                            <Text style={styles.rwSmallTxt}>per bag/hour</Text>
                        </View>
                        <View style={styles.rw}>
                            <MaterialIcons name="star" size={25} color={colors.secondary} />
                            <Text style={styles.rwTxt}>REVIEWS</Text>
                            <Text style={styles.rwSmallTxt}>{detail.average_rating} ({detail.total_reviews})</Text>
                        </View>
                    </View>

                    {detail.services && detail.services.length > 0 &&
                        <StoreServicesAvailable services={detail.services} />
                    }

                    <TimingAndBagsComponent
                        searchData={searchData}
                        setSearchData={setSearchData}
                        setShowCalender={setShowCalender}
                    />

                    {detail.predefine_location && detail.predefine_location.predefine_location &&
                        <StoreLandmarkComponent
                            landmarks={detail.predefine_location.predefine_location}
                        />
                    }


                    {AppConst.accessToken &&
                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>

                                    <Text style={styles.nrmlTxt}>{searchData.bags} {searchData.bags > 1 ? "bags" : "bag"} for {differenceTxt()}</Text>
                                    <View style={{ paddingTop: 10, flexDirection: "row" }}>
                                        <Text style={[styles.nrmlTxt, {}]}>Insurance up to 10000 per bag </Text>
                                        <AntDesign name='infocirlce' size={20} color={colors.primary} onPress={() => policyPress()} />
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.mediumBold}>{returnPrice(detail.checkout?.payments_sub_total)}</Text>
                                    <Text style={[styles.mediumBold, { color: colors.green, paddingTop: 5 }]}>Free</Text>
                                </View>
                            </View>
                            <View style={styles.subTotalView}>
                                <Text style={styles.nrmlTxt}>SubTotal</Text>
                                <Text style={styles.mediumBold}>{returnPrice(detail.checkout?.payments_sub_total)}</Text>
                            </View>
                            <Text style={[styles.mediumBold, { color: colors.black, fontSize: 16 }]}>
                                <Checkbox
                                    value={(detail?.checkout?.lugbee_credits == 0) ? false : lugbeeCredit ? true : false}
                                    onPress={() => (detail?.checkout?.lugbee_credits == 0) ? null : setLugbeeCredit(lugbeeCredit ? 0 : 1)}
                                />
                                <Text> Lugbee credits (Total credits: </Text>
                                <Text style={{ color: colors.primary }}>{detail.checkout?.lugbee_credits})</Text>
                            </Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
                                <View>

                                    <Text style={styles.nrmlTxt}>Lugbee credits</Text>
                                    <Text style={[styles.nrmlTxt, { paddingTop: 10 }]}>Total</Text>
                                </View>
                                <View>
                                    <Text style={styles.mediumBold}>- {returnPrice(detail.checkout?.discount_lugbee_credits)}</Text>
                                    <Text style={[styles.mediumBold, { paddingTop: 5 }]}>  {returnPrice(detail.checkout?.payments_total)}</Text>
                                </View>
                            </View>

                        </View>
                    }

                    {AppConst.accessToken &&
                        <View style={{ padding: 10, borderRadius: 5, backgroundColor: "#F4F8FA", marginHorizontal: 20, flexDirection: 'row' }}>
                            <Text style={[styles.rwTxt, { flex: 1 }]}>
                                <Text>Get </Text>
                                <Text style={{ color: colors.secondary }}>{detail?.checkout?.lugbee_credits_earn_per_booking} credits </Text>
                                <Text>for this booking</Text>
                            </Text>
                            <CoinSvg />
                        </View>
                    }

                    <View style={styles.primaryBoxInfo}>
                        <Text style={[styles.rwTxt, { color: colors.secondary, lineHeight: 25 }]}>Free Cancellation</Text>
                        <Text style={[styles.nrmlTxt, { color: colors.white }]}>If you cancel before the drop-off time, you will receive a full refund.</Text>
                    </View>

                </View>
            </ScrollView>
            <View style={{ paddingTop: 10 }}>
                <View style={{ padding: 20, paddingBottom: 5, paddingTop: 0, alignItems: "center" }}>
                    <Text style={{ ...styles.rwSmallTxt, }}>Your booking will be submitted once you click "Book Now".</Text>
                    <Text style={{ ...styles.rwSmallTxt, }}>You can choose your payment method on the next page.</Text>
                </View>
                <Button
                    title=" BOOK NOW"
                    textStyle={{ color: colors.primary, fontFamily: fonts.medium }}
                    icon={<LuggageTrolley />}
                    onPress={() => checkUserVerfification()}
                />
                <Button
                    title=' VIEW MAP'
                    backgroundColor={colors.primary}
                    onPress={() => setViewMapModal(true)}
                    textStyle={{ fontFamily: fonts.medium, color: colors.white }}
                    icon={<MaterialIcons name="location-pin" size={20} color={colors.white} />}
                />
            </View>
            {verifyModal &&
                <VerificationModal
                    close={() => {
                        setVerifyModal(false)
                        checkoutFunc();
                    }}
                    verifyType={verifyModal}
                />
            }
            {loading && <Loader />}
            {paymentDone ?
                <PaymentDoneModal
                    close={() => setpaymentDone(null)}
                    data={paymentDone}
                    onDone={() => {
                        setpaymentDone(null);
                        navigate("myBookings");
                    }}
                />
                : null
            }

            {veiwMapModal &&
                <GoogleRouteMap
                    coord={{ latitude: userReducer.searchDetail.lat, longitude: userReducer.searchDetail.lng }}
                    destination={{ lat: detail.geo_codes.split(",")[0], lng: detail.geo_codes.split(",")[1] }}
                    close={() => setViewMapModal(false)}
                />
            }

            {showCalender &&
                <CalenderModal
                    close={() => setShowCalender(false)}
                    selectedDate={showCalender.type === "from" ? moment(searchData.fromDate, "YYYY-MM-D").format("YYYY-MM-DD") : moment(searchData.toDate, "YYYY-MM-D").format("YYYY-MM-DD")}
                    type={showCalender.key}
                    isTimePicker={true}
                    minTime={{ hour: searchData.fromTime.split(":")[0], min: searchData.fromTime.split(":")[1] }
                        // showCalender.type === "from" ?
                        // {
                        //     hour: searchData.fromTime.split(":")[0] > moment().format("h") ? moment().format("h") : searchData.fromTime.split(":")[0],
                        //     min: searchData.fromTime.split(":")[1] > moment().format("m") ? getFormatTime().from.time.split(":")[1] : searchData.fromTime.split(":")[1]
                        // }
                        // :
                        // {
                        //     hour: searchData.fromDate == searchData.toDate ? searchData.fromTime.split(":")[0] : searchData.toTime.split(":")[0] > moment().format("h")
                        //         ? moment().format("h") : searchData.toTime.split(":")[0],
                        //     min: searchData.fromDate == searchData.toDate ? searchData.fromTime.split(":")[0] : searchData.toTime.split(":")[1] > moment().format("h")
                        //         ? getFormatTime().from.time.split(":")[1] : searchData.toTime.split(":")[1]
                        // }
                    }
                    minDate={showCalender.type === "from" ? null : (searchData.fromTime.split(":")[0] >= 23 ? moment(searchData.fromDate).add(1, "day").format("YYYY-MM-DD") : searchData.fromDate)}
                    onDaySelect={(d) => {
                        if (showCalender.type === "from") {
                            // setToCalender(true);
                            setToCalender({
                                ...searchData,
                                fromDate: d.date,
                                fromTime: d.time,
                            })
                            // setSearchData({
                            //     ...searchData,
                            //     fromDate: d.date,
                            //     fromTime: d.time,
                            // })
                            // setShowCalender({ type: "to", key: "To" });
                        } else {
                            setSearchData({
                                ...searchData,
                                toDate: d.date,
                                toTime: d.time,
                            })
                            if (toCalender) {
                                // setSearchData({
                                //     ...toCalender,
                                //     // ...searchData,
                                //     toDate: d.date,
                                //     toTime: d.time,
                                // })
                                setToCalender(false);
                            }
                        }
                        setShowCalender(false);
                    }}
                />
            }

            {loginModal &&
                <LoginAlertModal
                    close={() => setLoginModal(false)}
                />
            }

            {storeAvailableTime &&
                <StoreWeekTiming
                    close={() => setStoreAvailableTime(false)}
                    timings={detail.store_timings}
                />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    detailContainer: {
        width: screenWidth,
        backgroundColor: colors.white,
        flex: 1,
        // top: -10
    },
    borderView: {
        height: 40,
        width: screenWidth,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
    },
    rw: {
        height: 100,
        width: screenWidth / 3 - 20,
        maxWidth: 100,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: "#E6EFF3",
        marginRight: 10,
    },
    rwTxt: {
        ...largeMediumStyle,
        fontSize: 16,
    },
    rwSmallTxt: {
        ...smallTextSize,
        fontSize: 10
    },
    primaryBoxInfo: {
        marginHorizontal: 20,
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 20,
        marginVertical: 20
    },
    nrmlTxt: {
        ...commonTextStyle,
        color: colors.primary,
    },
    mediumBold: {
        ...largeMediumStyle,
        fontSize: 16,
    },
    subTotalView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grey,
        marginVertical: 10,
    },
    checkDetail: {
        padding: 10,
        backgroundColor: "#E6EFF3",
        borderRadius: 5,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        // alignSelf: "flex-start",
        // paddingVertical: 15
        height: 50
        // paddingHorizontal: 15
    },
    rowLeft: {
        ...commonTextStyle,
        color: colors.primary,
        width: "45%"
    },
    rowRight: {
        ...commonTextStyle,
        color: colors.primary,
        width: "45%"
    },
    rowDash: {
        ...commonTextStyle,
        color: colors.primary,
        position: "absolute",
        left: "50%"
    },
    nrmlHeavyTxt: {
        ...commonTextStyle,
        color: colors.primary,
        fontFamily: fonts.semiBold,

    }

});

export default StoreDetail;