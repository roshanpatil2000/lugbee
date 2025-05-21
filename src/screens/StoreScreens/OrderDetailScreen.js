import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import ReviewModal from '../../components/Modals/ReviewModal';
import { colors } from '../../styles/color'
import { commonTextStyle, MediumTextStyle } from '../../styles/CommonStyling';
import { getBookingsByStatus, rateBooking } from '../../store/actions/StoreAction';
import { Loader } from '../../components/custom/CustomFields';
import { AppConst, getStatusColor, returnPrice } from '../../constants/AppConst';
import OrderTimeline from '../../components/stores/Order/OrderTimeline';
import BookingStoreList, { ShowBookingStatus } from '../../components/stores/booking/BookingStoreList';


const OrderDetailScreen = ({ route, navigation }) => {
    const { d } = route.params;
    const [rate, setRate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(d);
    const [refreshing, setRefreshing] = useState(false);

    const allStatus = "completed,refunded,expired,cancelled,pending,confirmed,checkin,checkout"

    useEffect(() => {
        navigation.setOptions({
            title: detail.store_details?.name
        })
    }, [navigation]);

    const getSttsColor = (status) => {
        switch (status) {
            case 'pending':
                return colors.red;
            case 'completed':
                return colors.green;
            case 'confirmed':
                return colors.green;
            case 'cancelled':
                return colors.yellow;
            case 'expired':
                return colors.yellow;
            default:
                return colors.primary;
        }
    }

    const giveRating = (rating, comment) => {
        setRate(false);
        let data = {
            user_id: detail.user_id,
            storeId: detail.store_id,
            hostId: detail.host_id,
            rating,
            comment,
            bookingId: detail.id
        }
        setLoading(true);
        rateBooking(data).then(res => {
            setLoading(false);
        })
    }


    const returnAddress = () => {
        return detail.store_details.address_line1 + `${detail.store_details.address_line2 ? ", " + detail.store_details.address_line2 : ""}` + ", " + detail.store_details.city
    }

    const onRefresh = () => {
        setRefreshing(true);
        // setLoading(true);
        getBookingsByStatus(allStatus).then(res => {
            setRefreshing(false);
            // setLoading(false);
            if (res?.status == 200) {
                let booking = res.data.find(item => item.id == detail.id);
                console.log(booking);
                setDetail(booking);
            }
        })
    }


    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <OrderTimeline detail={detail} />
                {/* {detail.status !== "completed" &&
                    <TouchableOpacity style={styles.rfrshBtn} onPress={() => onRefresh()}>
                        <Text style={{ ...commonTextStyle, color: colors.white }}>Refresh</Text>
                    </TouchableOpacity>
                } */}
                <View style={styles.detailContainer}>



                    <View style={styles.bookingItem}>
                        <View style={styles.itemHeader}>
                            <Text style={[styles.storeName, { flex: 1 }]}>{detail.store_details?.name}</Text>

                        </View>
                        <View style={styles.innerContainer}>
                            <Image source={detail.store_details.profile_image_path_list?.length > 0 ? { uri: detail.store_details.profile_image_path_list[0] } : require("../../assets/images/NoStoreImage.jpg")} style={styles.img} />
                            <View style={{ flex: 1, padding: 10 }}>

                                <View style={{ paddingTop: 0, flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={{ flex: 1, }}>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Booking Id  </Text>
                                            <Text style={styles.greyTxt} numberOfLines={1}>{detail.booking_id_alias}</Text>

                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Drop off  </Text>
                                            <Text style={styles.greyTxt}>{moment(detail.dropoff_date + ", " + detail.dropoff_time, "YYYY-MM-DD, HH:mm").format("MMM Do YY, h:mm a")}</Text>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Pick-up  </Text>
                                            <Text style={styles.greyTxt}>{moment(detail.pickup_date + ", " + detail.pickup_time, "YYYY-MM-DD, HH:mm").format("MMM Do YY, h:mm a")}</Text>
                                        </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.nrmlTxt}>Bags  </Text>
                                            <Text style={styles.greyTxt}>{detail.bag_qty}</Text>
                                        </View>
                                        <ShowBookingStatus
                                            item={detail}
                                            showButton={false}
                                        />
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>



                    <View style={styles.storeInfo}>
                        <View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>Store Number</Text>
                            <Text style={{ ...commonTextStyle }}>{detail.store_details.mobile_no}</Text>
                        </View>
                        <View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>Store Address</Text>
                            <Text style={{ ...commonTextStyle, flex: 1 }}>{returnAddress()}</Text>
                        </View>
                    </View>
                    <View style={styles.storeInfo}>
                        <View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>Payment Status</Text>
                            <Text style={{ ...commonTextStyle, color: getStatusColor(detail.payment_status) }}>{detail.payment_status}</Text>
                        </View>
                        <View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>Booking Amount</Text>
                            <Text style={{ ...commonTextStyle, }}>{returnPrice(detail.payments_sub_total)}</Text>
                        </View>

                        <View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>Credits Used</Text>
                            <Text style={{ ...commonTextStyle, }}>{returnPrice(detail.discount_lugbee_credits)}</Text>
                        </View>
                        {detail.initial_pay && <View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>Intial Paid</Text>
                            <Text style={{ ...commonTextStyle, }}>{returnPrice(detail.initial_pay.payments_sub_total)}</Text>
                        </View>}
                        {<View style={styles.rowView}>
                            <Text style={{ ...styles.rowKey, width: "40%" }}>{detail.payment_status == "completed" ? "Total Paid" : "To Pay"}</Text>
                            <Text style={{ ...commonTextStyle, }}>{(detail.additional_pay && detail.payment_status == "pending") ? returnPrice(detail.additional_pay) : returnPrice(detail.payment_status == "pending" ? detail.payments_total : detail.payments_sub_total)}</Text>
                        </View>}
                    </View>

                </View>
            </ScrollView>

            {detail.status == "completed" && <TouchableOpacity style={styles.review} activeOpacity={1} onPress={() => setRate(true)}>
                <Text style={{ ...commonTextStyle, color: colors.white, flex: 1 }}>Leave a review</Text>
                <View style={styles.rowView}>
                    {new Array(5).fill(0).map((_, index) => {
                        return (
                            <Feather key={index} name="star" size={20} color={colors.white} />
                        )
                    })}
                </View>
            </TouchableOpacity>}

            {rate &&
                <ReviewModal
                    close={() => setRate(false)}
                    onSubmit={(rating, comment) => giveRating(rating, comment)}
                />
            }

            {loading && <Loader />}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    detailContainer: {
        marginHorizontal: 15,
        // padding: 10,
        // borderRadius: 10,
        // backgroundColor: "#F5F5F5",
    },
    bookingItem: {
        // margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grey,
        marginBottom: 10,
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
    rowView: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3
    },
    rowKey: {
        ...commonTextStyle,
        fontSize: 13,
        color: colors.black,
        width: "35%"
    },
    rowValue: {
        ...commonTextStyle,
        fontSize: 13,
        color: colors.darkGrey,
        flex: 1
    },
    smallTxt: {
        ...commonTextStyle,
        fontSize: 13
    },
    img: {
        height: 80,
        width: 80,
        borderRadius: 10,
        marginRight: 5,
        marginVertical: 8
    },
    storeInfo: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grey,
    },
    review: {
        flexDirection: "row",
        padding: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: "center",
        marginBottom: 15
    },
    greyTxt: {
        ...commonTextStyle,
        flex: 1,
        fontSize: 13
    },
    nrmlTxt: {
        ...commonTextStyle,
        color: colors.darkGrey,
        width: "35%",
        fontSize: 13
    },
})

export default OrderDetailScreen