import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Modal, ScrollView, Platform } from 'react-native'
import { colors } from '../../styles/color';
import Toast from 'react-native-toast-message';
import { commonTextStyle, largeMediumStyle } from '../../styles/CommonStyling';
import { Button, Loader } from '../custom/CustomFields';
import { navigate, popToTop } from '../../route/RootNavigation';
import { SuccessfulSvg } from '../../assets/svg/basic/basiciconSvg';
import { AppConst } from '../../constants/AppConst';
import { verifyTransaction } from '../../store/actions/StoreAction';
import { return12HrFormat } from '../../constants/TimeConst';
import { refreshBookingStatus } from '../../store/actions/UserAction';



const PaymentDoneModal = ({ close, data, onDone = () => { navigate("myBookings") } }) => {
    const [verifyData, setVerifyData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRefresh, setShowRefresh] = useState(false);
    const [apiCall, setApiCall] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        verifyTransaction(data.orderId, data.paymentId, data.signature, data.type).then(res => {
            setIsLoading(false);
            if (res.status == 200) {
                AppConst.showConsoleLog('res', res)
                setVerifyData(res.data)
                setShowRefresh(false);
                if (res.data.booking.payment_status == "pending") {
                    setTimeout(() => {
                        setApiCall(!apiCall)
                    }, 2000);
                }
            } else {
                AppConst.showConsoleLog('data res', res)
                alert(res.message)
                setShowRefresh(true)
            }
        })

    }, [apiCall]);

    const refreshPress = () => {
        if (showRefresh) {
            setApiCall(!apiCall);
            return;
        }
        setIsLoading(true);
        refreshBookingStatus(verifyData.booking.id).then(res => {
            setIsLoading(false);
            if (showRefresh) {
                setShowRefresh(false)
            }
            AppConst.showConsoleLog('res', res)
            if (res.status == 200) {
                setVerifyData({
                    ...verifyData,
                    booking: {
                        ...verifyData.booking,
                        payment_status: res.data.payment_status,
                        status: res.data.booking_status,
                    }
                })
            }
        })
    }

    return (
        <Modal
            visible
            animationType="slide"
            transparent={true}
            onRequestClose={() => null}
        >
            <View style={[styles.container, { paddingTop: Platform.OS == "ios" ? 20 : 0 }]}>

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ alignSelf: "center" }}>
                        <SuccessfulSvg scale={0.75} />
                        <Text style={styles.title}>Thank you for your Booking</Text>
                        <Text style={styles.subTitle}>Here is your booking receipt</Text>
                    </View>
                    <View style={styles.receiptContainer}>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Booking id</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.booking_id_alias}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Store name</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.store.name}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Store address</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.store.address_line1},{verifyData?.booking.store.address_line2}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Store number</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>+{verifyData?.booking.store.mobile_country_code} {verifyData?.booking.store.mobile_no}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Drop off</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.dropoff_date} {return12HrFormat(verifyData?.booking.dropoff_time)}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Pick off</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.pickup_date} {return12HrFormat(verifyData?.booking.pickup_time)}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Number of bag</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.bag_qty}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Booking Amount</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.payments_total}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Payment status</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.payment_status}</Text>
                        </View>
                        <View style={styles.subReceipt}>
                            <Text style={styles.rcptHdTxt}>Booking status</Text>
                            <Text style={styles.rcptTxt}>-</Text>
                            <Text style={styles.rcptValueTxt}>{verifyData?.booking.status}</Text>
                        </View>
                    </View>
                    {verifyData?.booking.payment_status && verifyData?.booking.payment_status == "pending" &&
                        <Text style={styles.pendingtxt}>Tap refresh for payment status</Text>
                    }
                </ScrollView>
                <View style={{ paddingBottom: 20 }}>
                    {
                        ((verifyData?.booking.payment_status && verifyData?.booking.payment_status == "pending") || showRefresh) &&
                        <Button
                            title="Refresh Booking"
                            onPress={() => refreshPress()}
                            textStyle={{ color: colors.white }}
                            backgroundColor={colors.primary}
                        />
                    }
                    <Button
                        title="Go to Booking"
                        onPress={() => onDone()}
                    />
                </View>

                {isLoading && <Loader />}
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    title: {
        ...largeMediumStyle,
        textAlign: "center",
        padding: 5
    },
    subTitle: {
        ...commonTextStyle,
        color: colors.grey,
        textAlign: "center"
    },
    receiptContainer: {
        padding: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginVertical: 10
    },
    subReceipt: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 4
    },
    rcptTxt: {
        ...commonTextStyle,
        color: colors.black,
        position: "absolute",
        left: "46%"
    },
    rcptHdTxt: {
        ...commonTextStyle,
        color: colors.black,
        width: "45%",
    },
    rcptValueTxt: {
        ...commonTextStyle,
        color: colors.black,
        width: "48%"
    },
    pendingtxt: {
        ...commonTextStyle,
        color: colors.secondary,
        paddingHorizontal: 20
    }
});

export default PaymentDoneModal;