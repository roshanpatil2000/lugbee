import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../../styles/color'
import { commonTextStyle, fonts, smallTextSize } from '../../../styles/CommonStyling'
import { screenWidth } from '../../../styles/ResponsiveLayout'


const OrderTimeline = ({ detail }) => {

    const nullValue = "1970-01-01"

    const linewidth = screenWidth / 16;

    const status = [
        {
            status: "Placed",
            done: true, //detail.payment_status == "pending" || detail.status == "confirmed" || detail.payment_status == "completed" ? true : false,
            date: detail.creation_date,
            time: detail.creation_time
        },
        {
            status: "Payment",
            done: detail.payment_status == "completed" || (detail.check_in_date !== nullValue && detail.check_in_date !== null) ? true : false,
            date: detail.payment_date && detail.payment_date !== nullValue ? detail.payment_date : "",
            time: detail.payment_date && detail.payment_date !== nullValue ? detail.payment_time : "",
        },
        {
            status: "Check in",
            done: detail.status == "checkin" || (detail.check_out_date !== nullValue && detail.check_out_date !== null) ? true : false,
            date: detail.check_in_date == nullValue || detail.check_in_date == null ? "" : detail.check_in_date,
            time: detail.check_in_date == nullValue || detail.check_in_date == null ? "" : detail.check_in_time,
        },
        {
            status: "Check out",
            done: detail.status == "checkout" || (detail.completed_date !== nullValue && detail.completed_date !== null) ? true : false,
            date: detail.check_out_date == nullValue || detail.check_out_date == null ? "" : detail.check_out_date,
            time: detail.check_out_date == nullValue || detail.check_out_date == null ? "" : detail.check_out_time,
        },
        {
            status: "Completed",
            done: detail.status == "completed" ? true : false,
            date: detail.completed_date == nullValue || detail.completed_date == null ? "" : detail.completed_date,
            time: detail.completed_date == nullValue || detail.completed_date == null ? "" : detail.completed_time,
        },
    ]

    // console.log("status", screenWidth / 25)
    return (
        <View style={{ alignSelf: "center" }}>
            <View style={{ flexDirection: "row", justifyContent: "center", left: 8 }}>
                {status.map((item, index) => {
                    return (
                        <View key={String(index)} style={{ marginVertical: 20, alignItems: "center", left: index == 0 ? 1 : 0, }}>
                            <View style={{ flexDirection: "row", alignItems: "center", right: index == 4 ? 10 : 0 }}>
                                {index !== 0 && <View
                                    style={{
                                        width: linewidth,
                                        height: 3,
                                        backgroundColor: item.done ? colors.secondary : colors.grey,
                                    }}
                                />}
                                {/* <View style={{ padding: 0, borderWidth: 0.5, borderColor: colors.grey, borderRadius: 30 }}> */}
                                <View style={{ padding: 5, backgroundColor: item.done ? colors.secondary : colors.grey, borderRadius: 20 }}>
                                    <AntDesign name='check' size={15} color={colors.white} />
                                </View>
                                {/* </View> */}
                                {index !== status.length - 1 && <View
                                    style={{
                                        width: linewidth,
                                        height: 3,
                                        backgroundColor: item.done ? colors.secondary : colors.grey,
                                    }}
                                />}
                            </View>
                            <View style={{ maxWidth: 80, marginTop: 5, alignItems: "center", left: index == 0 ? -10 : index == status.length - 1 ? 0 : 0 }}>
                                <Text
                                    style={[
                                        styles.status,
                                        // { left: index == 0 ? -10 : index == status.length - 1 ? 10 : 0 },
                                    ]}
                                >{item.status}</Text>
                                <Text style={styles.dateTxt}>{item.date}</Text>
                                <Text style={styles.dateTxt}>{item.time}</Text>
                            </View>
                        </View>
                    )
                })}

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    status: {
        ...smallTextSize,
        fontFamily: fonts.medium,
        color: colors.black,
        fontSize: 10,
        textAlign: "center"
    },
    dateTxt: {
        ...smallTextSize,
        color: colors.black,
        fontSize: 9,
        marginTop: 2
        // alignSelf: "flex-start",
        // left: -5
    }
});

export default OrderTimeline;