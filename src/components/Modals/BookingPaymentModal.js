import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Modal, ScrollView, Platform } from 'react-native'
import RazorpayCheckout from 'react-native-razorpay'
import { useSelector } from 'react-redux'
import { CoinSvg } from '../../assets/svg/basic/basiciconSvg'
import { AppConst, RazorpayConst } from '../../constants/AppConst'
import { goBack } from '../../route/RootNavigation'
import { createTransaction, userPaymentCheckout } from '../../store/actions/UserAction'
import { colors } from '../../styles/color'
import { commonTextStyle, largeMediumStyle, MediumTextStyle } from '../../styles/CommonStyling'
import { Button, Checkbox, Loader } from '../custom/CustomFields'
import PaymentDoneModal from './PaymentDoneModal'



const BookingPaymentModal = ({ close, detail, onPaymentDone = () => { } }) => {
    const [lugbeeCredit, setLugbeeCredit] = useState(1);
    const [apiCall, setApiCall] = useState(true);
    const [paymentData, setPaymentData] = useState({});
    const [loading, setLoading] = useState(false);
    const [bookingId, setBookingId] = useState(detail.id);
    const [paymentDone, setPaymentDone] = useState(null);
    const userProfile = useSelector(state => state.user.userDetail);

    useEffect(() => {
        setLoading(true);
        userPaymentCheckout(detail.id, lugbeeCredit).then(res => {
            setLoading(false);
            console.log("res--", res)
            if (res.status == 200) {
                setPaymentData(res.data)
            }
        })
    }, [lugbeeCredit]);


    const onPayPress = () => {
        setLoading(true);
        const params = {
            hostId: detail.host_id,
            bookingId: bookingId,
            storeId: detail.store_id,
            lugbeeCredit
        }
        createTransaction(params).then((res) => {
            AppConst.showConsoleLog('createTransaction res: ', res)
            setLoading(false);
            if (res.status == 200) {
                // setBookingId(res.data.booking_data.id);
                let data = {
                    amount: (Number(res.data.order_amount) * 100).toString(),
                    pay_currency: res.data.pay_currency,
                    return_url: res.data.return_url,
                    order_id: res.data.trans_ref
                }
                if (res.data.razorpay) {
                    makePayment(data);
                } else {
                    setPaymentDone({
                        paymentId: "direct_pay",
                        signature: "lugbee_sign",
                        orderId: res.data.order_id,
                        type: "lugbee_credits",
                    });
                }
            }
        })
    }


    const makePayment = (data) => {
        var options = {
            description: `Pay to Lugbee`,
            // image: 'https://i.imgur.com/3g7nmJC.png',
            currency: data.pay_currency,
            key: RazorpayConst.key, // Your api key
            order_id: data.order_id,
            // callback_url: data.return_url,
            amount: data.amount,     // in paise
            name: RazorpayConst.name,
            prefill: {
                email: userProfile?.email_id ? userProfile?.email_id : "",
                contact: userProfile?.mobile_no ? userProfile?.mobile_no : "",
                name: userProfile.first_name ? userProfile.first_name + " " + userProfile.last_name ? userProfile.last_name : "" : ''
            },
            theme: { color: colors.primary }
        }
        AppConst.showConsoleLog("options", options);
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            console.log("data", data, data.razorpay_signature);
            setPaymentDone({
                paymentId: data.razorpay_payment_id,
                signature: data.razorpay_signature,
                orderId: data.razorpay_order_id,
                type: "lugbee_credits"
            });
            // alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            console.log("error", error);
            // alert(`Error: ${error.description}`);
        });
    }

    // AppConst.showConsoleLog(detail.store_details)

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={() => { }}
        >
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ marginTop: Platform.OS == "ios" ? 50 : 20 }}>
                        <View style={styles.viewHeader}>
                            <Text style={styles.hdrTxt}>Booking Info</Text>
                            <Text style={[styles.hdrTxt, { color: colors.secondary }]}>{detail.status}</Text>
                        </View>
                        <View style={styles.infoBody}>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Booking ID</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{detail.booking_id_alias}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Number of bag</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{detail.bag_qty}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Drop-off</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{moment(detail.dropoff_date + ", " + detail.dropoff_time, "YYYY-MM-DD, HH:mm").format("MMM Do YYYY, h:mm a")}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Pick-up</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{moment(detail.pickup_date + ", " + detail.pickup_time, "YYYY-MM-DD, HH:mm").format("MMM Do YYYY, h:mm a")}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Extra Booking hours</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{paymentData?.extra_time}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Total Booking hours</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{paymentData?.total_time}</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={styles.viewHeader}>
                            <Text style={styles.hdrTxt}>Payment Info</Text>
                            <Text style={[styles.hdrTxt, { color: colors.secondary }]}>{detail.payment_status}</Text>
                        </View>
                        <View style={styles.infoBody}>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Total booking amount</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{paymentData?.payments_sub_total}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Total of paid amount</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{paymentData?.already_pay ? paymentData?.already_pay : '0'}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Additional paid amount</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={styles.valuetxt}>{paymentData?.additional_pay ? paymentData?.additional_pay : "0"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Checkbox
                                value={lugbeeCredit ? true : false}
                                onPress={() => setLugbeeCredit(lugbeeCredit ? 0 : 1)}
                            />
                            <Text style={{ ...styles.hdrTxt }}> Lugbee credits (Total credits: </Text>
                            <Text style={{ ...styles.hdrTxt, color: colors.primary }}>{paymentData?.lugbee_credits})</Text>
                        </View>
                        <View style={{ paddingVertical: 10 }}>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Lugbee credits</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={[styles.amountTxt]}>- {paymentData?.discount_lugbee_credits ? paymentData?.discount_lugbee_credits : "0"}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.keyTxt}>Total</Text>
                                <Text style={styles.dash}>-</Text>
                                <Text style={[styles.amountTxt]}>  {paymentData?.payments_grand_total}</Text>
                            </View>
                        </View>
                        <View style={{ padding: 10, borderRadius: 5, backgroundColor: "#F4F8FA", flexDirection: 'row' }}>
                            <Text style={[commonTextStyle, { flex: 1 }]}>
                                <Text>Get </Text>
                                <Text style={{ color: colors.secondary }}>{paymentData?.lugbee_credits_earn_per_booking} credits </Text>
                                <Text>for this booking</Text>
                            </Text>
                            <CoinSvg />
                        </View>
                    </View>

                    <View style={{ paddingBottom: 20 }}>
                        <Button
                            title="Cancel"
                            backgroundColor={colors.white}
                            style={{ borderWidth: 1, borderColor: colors.primary, }}
                            onPress={() => close()}
                        />
                        <Button
                            title="Pay Now"
                            onPress={() => onPayPress()}
                        />

                    </View>
                </ScrollView>
                {loading && <Loader />}

                {paymentDone ?
                    <PaymentDoneModal
                        close={() => setPaymentDone(null)}
                        data={paymentDone}
                        onDone={() => {
                            setPaymentDone(null);
                            onPaymentDone()
                        }}
                    />
                    : null
                }
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    viewHeader: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: "#EEEFF0",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grey,
        justifyContent: "space-between",
        paddingVertical: 10
    },
    hdrTxt: {
        ...MediumTextStyle,
    },
    infoBody: {
        padding: 10,
        margin: 20,
        borderWidth: 0.5,
        borderColor: colors.grey,
        borderRadius: 5,
        paddingRight: 5
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        justifyContent: "space-between",
        marginVertical: 2
    },
    keyTxt: {
        ...commonTextStyle,
        width: "55%",
        // color: colors.darkGrey
    },
    valuetxt: {
        ...commonTextStyle,
        width: "40%",
    },
    dash: {
        ...commonTextStyle,
        color: colors.darkGrey,
        position: "absolute",
        right: "45%"
    },
    amountTxt: {
        ...largeMediumStyle,
        color: colors.primary,
        fontSize: 15,
        width: "40%"
    }
})

export default BookingPaymentModal