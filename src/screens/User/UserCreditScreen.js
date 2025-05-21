import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { colors } from '../../styles/color'
import { CoinSvg, PointsSvg } from '../../assets/svg/basic/basiciconSvg'
import { commonTextStyle, fonts, largeMediumStyle, MediumTextStyle } from '../../styles/CommonStyling'
import { getuserCredits } from '../../store/actions/UserAction'
import moment from 'moment'
import { Loader } from '../../components/custom/CustomFields'
import { DrawerScreenOptions } from '../../route/StackNavigation'



const UserCreditScreen = ({ navigation }) => {
    const [transactions, setTransactions] = useState(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getuserCredits(page).then(res => {

            setIsLoading(false);
            if (res.status == 200) {
                if (transactions && transactions.result && page > 1) {
                    setTransactions({ ...transactions, result: [...transactions.result, ...res.data.result] });
                } else {
                    setTransactions(res.data)
                }
            }
        })
    }, [page]);

    useEffect(() => {
        navigation.setOptions({
            ...DrawerScreenOptions({ navigation: navigation })
        })
    }, [navigation]);


    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };


    console.log("total pages--", transactions?.pages, page);

    return (
        <View style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                onMomentumScrollEnd={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (transactions && page < transactions.pages && !isLoading)
                            setPage(page + 1);
                    }
                    return;
                }}
            >
                <View style={{ alignItems: "center", marginVertical: 20 }}>
                    <PointsSvg />
                    <Text style={{ marginVertical: 10 }}>
                        <CoinSvg />
                        <Text style={styles.boldTxt}> You have {transactions?.balance} credits</Text>
                    </Text>
                    <Text style={[styles.greyTxt, {}]}>Worth INR {transactions?.balance ? transactions?.balance * transactions?.rate : ""} ( {transactions?.rate} INR = 1 Credits )</Text>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ ...MediumTextStyle, color: colors.black }}>{transactions && transactions.result.length > 0 ? "Activities" : ""}</Text>
                    {transactions && transactions.result.map((item, index) => {
                        return (
                            <View key={String(index)} style={styles.item}>
                                <View style={[{ paddingVertical: 0 }]}>
                                    <Text style={styles.itemValuetxt}>{item.activityTitle}</Text>
                                    <Text style={styles.itemGreyTxt}>{moment(new Date(item.createTs * 1000)).format("DD MMMM YYYY")}</Text>
                                    <View style={styles.hor}>
                                        <Text style={styles.itemGreyTxt}>Credits {item.type == "cr" ? "Earned" : "Used"}  </Text>
                                        <Text style={[styles.itemValuetxt, { color: item.type == "cr" ? colors.green : colors.red }]}>{item.type == "cr" ? "+" : "-"}{item.value}</Text>
                                    </View>
                                    <Text style={styles.itemGreyTxt}>
                                        <Text>{item.activityDescription}</Text>
                                    </Text>
                                </View>
                            </View>
                        )
                    })}

                </View>
            </ScrollView>
            {isLoading && <Loader />}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    boldTxt: {
        ...largeMediumStyle,
        color: colors.primary
    },
    greyTxt: {
        ...commonTextStyle,
        color: colors.darkGrey
    },
    hor: {
        flexDirection: "row",
    },
    item: {
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10
    },
    itemGreyTxt: {
        ...commonTextStyle,
        color: colors.darkGrey,
        paddingVertical: 2,
        // width: "50%",
        // paddingRight: 10
    },
    itemValuetxt: {
        ...commonTextStyle,
        color: colors.black,
        paddingVertical: 2,
        fontFamily: fonts.medium,
        fontSize: 15
        // width: "50%",
        // paddingLeft: 20
    },
    dash: {
        position: "absolute",
        left: "48%",
        ...commonTextStyle,
        color: colors.darkGrey,
    }
})

export default UserCreditScreen