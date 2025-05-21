import moment from 'moment'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, RefreshControl, FlatList } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getStatusColor } from '../../../constants/AppConst'
import { navigate } from '../../../route/RootNavigation'
import { colors } from '../../../styles/color'
import { commonTextStyle, fonts, MediumTextStyle } from '../../../styles/CommonStyling'

const statusText = {
    paymentPending: `Yout booking will be confirmed after making the payment. Click "Pay Now" to make the payment.`,
    partialPayment: `Partial amount of this booking is not paid. Click "Pay Now" to make the payment.`,
    checkIn: "You have checked in your bags in this Lugbee store",
    checkOut: "You have checked out your bags in this Lugbee store",
    completed: "Your booking has been completed",
    cancelled: "Your booking has been cancelled",
    expired: "Your booking has been expired",
}

const BookingStoreList = ({ list, onMorePress, refreshing, onRefresh, onOptionPress }) => {



    const goToDetail = (item) => {
        navigate("orderDetail", { d: item })
    }



    return (
        <View>
            <FlatList
                key={(a, b) => String(b)}
                data={list}
                contentContainerStyle={{ paddingVertical: 10 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => {
                    return <View style={styles.bookingItem}>
                        <View style={styles.itemHeader}>
                            <Text style={[styles.storeName, { flex: 1 }]}>{item.store_details?.name}</Text>
                            <TouchableOpacity onPress={() => goToDetail(item)} style={styles.arrow}>
                                <AntDesign name="arrowright" size={15} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.innerContainer}>
                            <TouchableOpacity onPress={() => navigate("orderDetail", { d: item })}>
                                <Image source={item.store_details.profile_image_path_list?.length > 0 ? { uri: item.store_details.profile_image_path_list[0] } : require("../../../assets/images/NoStoreImage.jpg")} style={styles.storeImg} />
                            </TouchableOpacity>
                            <View style={{ flex: 1, padding: 10 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    {/* <View style={[styles.sttstxt, { borderColor: getStatusColor(item.status), flex: 1, alignSelf: "flex-end" }]}>
                                        <Text style={[commonTextStyle, { color: getStatusColor(item.status), }]}>{item.status}</Text>
                                    </View> */}
                                </View>
                                <View style={{ paddingTop: 0, flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={{ flex: 1, }}>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Booking Id  </Text>
                                            <Text style={styles.greyTxt} numberOfLines={1}>{item.booking_id_alias}</Text>

                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Drop off  </Text>
                                            <Text style={styles.greyTxt}>{moment(item.dropoff_date + ", " + item.dropoff_time, "YYYY-MM-DD, HH:mm").format("MMM Do YY, h:mm a")}</Text>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Pick-up  </Text>
                                            <Text style={styles.greyTxt}>{moment(item.pickup_date + ", " + item.pickup_time, "YYYY-MM-DD, HH:mm").format("MMM Do YY, h:mm a")}</Text>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Bags  </Text>
                                            <Text style={styles.greyTxt}>{item.bag_qty}</Text>
                                        </View>
                                        {/* <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Payment Status  </Text>
                                            <Text style={[styles.greyTxt, { color: item.payment_status == "pending" ? colors.red : item.payment_status == "completed" ? colors.green : colors.yellow }]}>{item.payment_status}</Text>
                                        </View> */}
                                        <ShowBookingStatus
                                            item={item}
                                            onOptionPress={onOptionPress}
                                        />
                                    </View>

                                    {/* <SimpleLineIcons name='options-vertical' size={20} color={colors.black} style={styles.optnIcon} onPress={() => onMorePress(item)} /> */}
                                </View>
                            </View>
                        </View>
                    </View>
                }
                }
            />
        </View>
    )
}


const getActionButtons = (item) => {
    return [
        {
            text: (item.payment_status == "pending" || item.payment_status == "partial_completed") && item.status !== "expired" ? "Pay now" : "", //partial_completed
            color: colors.yellow,
            key: "pay"
        },
        {
            text: moment().isBefore(moment(`${item.dropoff_date}, ${item.dropoff_time}`, "YYYY-MM-DD, HH:mm")) && (item.status !== "cancelled") ? "Cancel Booking" : "",
            color: colors.red,
            key: "cancel"
        },
        {
            text: item.status == "completed" ? "Review" : "",
            key: "review"
        }
    ]
}


export const ShowBookingStatus = ({ item, showButton = true, onOptionPress }) => {
    return (
        <View style={{ paddingVertical: 5 }}>
            <Text
                style={[styles.text, { color: item.payment_status == "pending" || item.status == "expired" || item.status == "cancelled" ? colors.secondary : colors.green }]}
            >
                {
                    item.status == "expired" ?
                        "Booking Expired" :
                        item.status == "cancelled" ?
                            "Booking Cancelled" :
                            item.payment_status == "pending" ?
                                "Payment pending" :
                                "Booking Confirmed"
                }
            </Text>

            <Text style={[styles.greyTxt, { fontSize: 10, paddingTop: 3, fontFamily: fonts.italic }]}>
                {
                    item.status == "expired" ?
                        statusText.expired :
                        item.status == "cancelled" ?
                            statusText.cancelled :
                            item.payment_status == "pending" ?
                                statusText.paymentPending :
                                statusText[item.status]
                }
            </Text>
            {showButton && getActionButtons(item).filter(i => i.text !== "").length > 0 &&
                <View style={{ flexDirection: "row", flexWrap: "wrap", paddingTop: 0 }}>
                    {getActionButtons(item).filter(i => i.text !== "").map((action, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionBtn}
                                onPress={() => onOptionPress(action, item)}
                            >
                                <Text style={{ ...styles.btnTxt }}>{action.text}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    bookingItem: {
        margin: 10,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginVertical: 10,
    },
    itemHeader: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    innerContainer: {
        paddingHorizontal: 10,
        flexDirection: "row",
        flex: 1

    },
    storeName: {
        ...MediumTextStyle,
        color: colors.primary,
        flex: 1
    },
    arrow: {
        padding: 5,
        backgroundColor: colors.secondary,
        borderRadius: 20,
    },
    text: {
        ...commonTextStyle,
        fontFamily: fonts.medium
    },
    storeImg: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginTop: 15
    },
    nrmlTxt: {
        ...commonTextStyle,
        width: "35%",
        fontSize: 13
    },
    greyTxt: {
        ...commonTextStyle,
        color: colors.darkGrey,
        flex: 1,
        fontSize: 13
    },
    actionBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 0.8,
        borderColor: colors.secondary,
        marginRight: 10,
        marginTop: 10
    },
    rowView: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2
    },
    optnIcon: {
        position: "absolute",
        right: -5,
        top: "35%",
        zIndex: 1
    },
    btnTxt: {
        ...commonTextStyle,
        fontSize: 12,
        color: colors.primary
    }
})

export default BookingStoreList