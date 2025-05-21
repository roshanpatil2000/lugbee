import moment from 'moment'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../../styles/color'
import { commonTextStyle, largeMediumStyle } from '../../../styles/CommonStyling'
import AlertHeader from '../../custom/AlertHeader'


const StoreWeekTiming = ({ close, timings }) => {
    const [timeArr, setTimeArr] = React.useState([]);

    useEffect(() => {
        let arr = [];
        for (var key in timings) {
            arr.push(timings[key]);
        }
        // console.log(arr)
        setTimeArr(arr)
    }, []);

    const returnDay = (index) => {
        switch (index) {
            case 0:
                return "Monday"
            case 1:
                return "Tuesday"
            case 2:
                return "Wednesday"
            case 3:
                return "Thursday"
            case 4:
                return "Friday"
            case 5:
                return "Saturday"
            case 6:
                return "Sunday"
            default:
                return "Monday"
        }
    }

    return (
        <Modal
            visible
            transparent
            onRequestClose={() => close()}
            animationType="slide"
        >
            <View style={styles.container}>
                <View style={styles.timeContainer}>
                    <AlertHeader
                        title="Store Timings"
                    />

                    <View style={{ paddingHorizontal: 10 }}>
                        {timeArr.map((item, index) => {
                            return (
                                <View key={index} style={[styles.item, { borderBottomWidth: index == timeArr.length - 1 ? 0 : 0.5 }]}>
                                    <View style={[styles.timeRow]} key={index}>
                                        <Text style={styles.timeTxt}>{returnDay(index)}</Text>
                                        <Text style={styles.timeSmallTxt}>{(item.start_time == "00:00:00.000" && item.end_time == "00:00:00.000") ? "Off" : `${moment(item.start_time, "HH:mm:ss").format("h:mm a")} - ${item.end_time ? moment(item.end_time, "HH:mm:ss").format("h:mm a") : ""}`}</Text>
                                    </View>

                                    {
                                        (item.off_dates && item.off_dates.length > 0) &&
                                        <View style={{ paddingTop: 10, ...styles.timeRow }}>
                                            <Text style={[styles.timeSmallTxt, { color: colors.darkGrey }]}>Close Dates</Text>
                                            <Text style={[styles.timeSmallTxt, { color: colors.darkGrey }]}>{item.off_dates.join(", ")}</Text>
                                        </View>
                                    }
                                </View>
                            )
                        }
                        )}
                    </View>
                    <TouchableOpacity onPress={() => close()} style={styles.closeIcon}>
                        <AntDesign name="close" size={30} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
    },
    timeContainer: {
        backgroundColor: colors.white,
        borderRadius: 20,
        // padding: 10,
        marginHorizontal: 20,
        paddingBottom: 10
    },
    header: {
        padding: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: colors.grey,
    },
    hdTxt: {
        ...largeMediumStyle,
        color: colors.black
    },
    closeIcon: {
        padding: 5,
        alignSelf: "center",
        borderRadius: 20,
        backgroundColor: colors.secondary,
        marginTop: 10
    },
    item: {
        padding: 10,
        marginVertical: 5,
        borderColor: colors.grey
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",

    },
    timeTxt: {
        ...commonTextStyle
    },
    timeSmallTxt: {
        ...commonTextStyle,
        fontSize: 12
    }
})

export default StoreWeekTiming