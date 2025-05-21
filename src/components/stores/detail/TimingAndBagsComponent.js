import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../../styles/color'
import { commonTextStyle, fonts, largeMediumStyle, MediumTextStyle } from '../../../styles/CommonStyling'


const TimingAndBagsComponent = ({ searchData, setSearchData, setShowCalender }) => {

    return (
        <View style={{ paddingTop: 20, marginHorizontal: 20, flexDirection: "row", alignItems: "center", }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.hdTxt, {}]}>Timings</Text>
                <View style={styles.checkDetail}>
                    <TouchableOpacity onPress={() => setShowCalender({ type: "from", key: "From" })} style={styles.row}>
                        <Text style={styles.nrmlHeavyTxt}>{moment(searchData.fromDate, "YYYY-MM-DD").format("DD MMM")}</Text>
                        <Text style={styles.nrmlTxt}>{moment(searchData.fromTime, "HH:mm").format("hh:mm a")}</Text>
                    </TouchableOpacity>
                    <View style={styles.rowDash} />
                    <TouchableOpacity onPress={() => setShowCalender({ type: "to", key: "To" })} style={styles.row}>
                        <Text style={styles.nrmlHeavyTxt}>{moment(searchData.toDate, "YYYY-MM-DD").format("DD MMM")}</Text>
                        <Text style={styles.nrmlTxt}>{moment(searchData.toTime, "HH:mm").format("hh:mm a")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.hdTxt}>No of bags</Text>
                <View style={styles.bagView}>
                    <View style={{}}>
                        <TouchableOpacity style={styles.borderRadius} onPress={() => searchData.bags == 1 ? null : setSearchData({ ...searchData, bags: searchData.bags - 1 })}>
                            <AntDesign name='minus' size={15} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={[styles.nrmlTxt, { fontFamily: fonts.medium, marginVertical: 3, textAlign: "center" }]}>{searchData.bags}</Text>
                        <TouchableOpacity style={styles.borderRadius} onPress={() => searchData.bags == 50 ? null : setSearchData({ ...searchData, bags: searchData.bags + 1 })}>
                            <AntDesign name='plus' size={15} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    checkDetail: {
        padding: 10,
        backgroundColor: "#E6EFF3",
        flex: 1,
        flexDirection: "row",
        // justifyContent: "space-around",
        // alignItems: "center",
        height: 80,
        marginTop: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    row: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    hdTxt: {
        ...largeMediumStyle,
        fontSize: 16,
    },
    rowDash: {
        position: "absolute",
        right: "55%",
        height: 50,
        width: .75,
        backgroundColor: colors.primary,
        top: 15
    },
    nrmlHeavyTxt: {
        ...MediumTextStyle,
        color: colors.primary,
        fontFamily: fonts.semiBold,
        marginBottom: 2
    },
    nrmlTxt: {
        ...commonTextStyle,
        color: colors.primary,
    },
    borderRadius: {
        padding: 1,
        borderRadius: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: colors.primary
    },
    bagView: {
        padding: 10,
        backgroundColor: "#E6EFF3",
        alignItems: "center",
        height: 80,
        marginTop: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    }
})

export default TimingAndBagsComponent