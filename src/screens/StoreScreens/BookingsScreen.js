import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert, RefreshControl } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { colors } from '../../styles/color';
import { commonTextStyle, fonts, largeMediumStyle, MediumTextStyle } from '../../styles/CommonStyling';
import { cancelBooking, getBookingsByStatus, rateBooking } from '../../store/actions/StoreAction';
import { Loader } from '../../components/custom/CustomFields';
import moment from 'moment';
import BottomListSheet from '../../components/custom/BottomListSheet';
import { navigate } from '../../route/RootNavigation';
import BookingPaymentModal from '../../components/Modals/BookingPaymentModal';
import { DrawerScreenOptions } from '../../route/StackNavigation';
import ReviewModal from '../../components/Modals/ReviewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setIsHome } from '../../store/actions/AppAction';
import BookingStoreList from '../../components/stores/booking/BookingStoreList';



const BookingsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState({ key: "pending", apiKey: "pending,checking,checkout,confirmed,checkin,checkout" });
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [moreOption, setMoreOption] = useState(false);
    const [apiCall, setApiCall] = useState(false);
    const [payModal, setPayModal] = useState(null);
    const [rate, setRate] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isHome = useSelector(state => state.app.isHome)
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        getBookingsByStatus(activeTab.apiKey).then(res => {
            setIsLoading(false);
            if (refreshing) {
                setRefreshing(false);
            }
            if (res.status == 200) {
                let SortedBookings = res.data.sort((a, b) => {
                    return Number(b.booking_id_alias) - Number(a.booking_id_alias);
                })
                setBookings(SortedBookings);
                // setBookings(res.data.reverse())
            } else {
                setBookings([])
            }
        });
    }, [activeTab, apiCall])

    useEffect(() => {
        if (isHome) {
            dispatch(setIsHome(false))
        }
    }, [navigation]);

    const tabs = [
        {
            name: "New",
            key: "pending",
            apiKey: "pending,checking,checkout,confirmed,checkin,checkout"
        },
        {
            name: "Past",
            key: "other",
            apiKey: "completed,refunded,expired,cancelled"
        }
    ];


    const onMorePress = (item) => {

        // console.log("item--", item.payment_status);
        setMoreOption({
            options: [
                {
                    text: "View booking",
                    key: "view"

                },
                {
                    text: (item.payment_status == "pending" || item.payment_status == "partial_completed") && item.status !== "expired" ? "Pay now" : "", //partial_completed
                    color: colors.yellow,
                    key: "pay"
                },
                {
                    text: moment().isBefore(moment(`${item.dropoff_date}, ${item.dropoff_time}`, "YYYY-MM-DD, HH:mm")) && (item.status == "pending") ? "Cancel Booking" : "",
                    color: colors.red,
                    key: "cancel"
                },
                {
                    text: item.status == "completed" ? "Review" : "",
                    key: "review"
                }
            ],
            detail: item
        });
    }


    const onOptionPress = (item, booking) => {
        switch (item.key) {
            case "view":
                navigate("orderDetail", { d: booking });
                break;
            case "cancel":
                cancelPress(booking.id);
                break;
            case "pay":
                setPayModal(booking);
                break;
            case "review":
                // giveRating(moreOption.detail);
                setRate(booking);
                break;
            default:
                break;
        }
        setMoreOption(null);
    }

    const giveRating = (rating, comment) => {
        // setRate(false);
        let data = {
            user_id: rate.user_id,
            storeId: rate.store_id,
            hostId: rate.host_id,
            rating,
            comment,
            bookingId: rate.id
        }
        // console.log("data--", data);
        // return;
        setRate(null);
        setIsLoading(true);
        rateBooking(data).then(res => {
            setIsLoading(false);
        })
    }


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


    const cancelPress = (id) => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to Cancel Booking?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {
                        setIsLoading(true);
                        cancelBooking(id).then(res => {
                            setIsLoading(false);
                            setApiCall(!apiCall);
                            console.log("res--", res);
                        })
                    }, style: "destructive"
                }
            ]
        );
        return;
    }


    const onRefresh = () => {
        setApiCall(!apiCall);
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{}}>
                    <Text style={largeMediumStyle}>Bookings</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                    {tabs.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.hdTab, activeTab.key == item.key ? styles.activeTab : null,]}
                                onPress={() => {
                                    setActiveTab(item)
                                }}
                            >
                                <Text style={[styles.headerText, activeTab.key == item.key ? styles.activeTabText : null]}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <BookingStoreList
                    onMorePress={onMorePress}
                    list={bookings}
                    refreshing={refreshing}
                    onOptionPress={(item, booking) => onOptionPress(item, booking)}
                    onRefresh={onRefresh}
                />
                {!isLoading && bookings.length == 0 && <Text style={styles.noData}>No Bookings</Text>}
            </View>
            {isLoading && <Loader />}



            {moreOption &&
                <BottomListSheet
                    options={moreOption.options}
                    close={() => setMoreOption(null)}
                    onPress={(item) => onOptionPress(item)}
                />
            }

            {payModal &&
                <BookingPaymentModal
                    close={() => setPayModal(null)}
                    detail={payModal}
                    onPaymentDone={() => {
                        setPayModal(null);
                        setApiCall(!apiCall);
                    }}
                />
            }

            {rate &&
                <ReviewModal
                    close={() => setRate(false)}
                    onSubmit={(rating, comment) => giveRating(rating, comment)}
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
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 5,
        paddingTop: 15
    },
    hdTab: {
        // width: "50%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F7FA",
        marginHorizontal: 10,
        paddingHorizontal: 25,
        borderRadius: 30

    },
    activeTab: {
        backgroundColor: colors.secondary
    },
    activeTabText: {
        fontFamily: fonts.semiBold
    },
    headerText: {
        ...MediumTextStyle,
        color: colors.primary,
        fontFamily: fonts.regular,
        fontSize: 14
    },
    bookingItem: {
        margin: 10,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        flexDirection: "row",
        marginVertical: 10,
        paddingLeft: 10
    },
    text: {
        ...MediumTextStyle
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
    sttstxt: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 0.8,
        borderColor: colors.secondary,
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
    noData: {
        ...MediumTextStyle,
        alignSelf: "center",
        position: "absolute",
        top: "45%",

    }
});

export default BookingsScreen