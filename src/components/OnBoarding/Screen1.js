import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { commonTextStyle, HeavyTextStyle, LargeTextStyle, primaryColorBackground } from '../../styles/CommonStyling'
import { FirstScreenSvg } from '../../assets/svg/splash/OnBoardingSvgs'
import { colors } from '../../styles/color'
import { BuubleBackgroundSvg } from '../../assets/svg/splash/SplashSvgs'
import { screenWidth } from '../../styles/ResponsiveLayout'

const Screen1 = ({ }) => {
    return (
        <View style={{ ...primaryColorBackground, width: screenWidth }}>
            <View style={{ position: "absolute", transform: [{ scale: 0.9 }], left: 70, top: -50, overflow: "hidden" }}>
                <FirstScreenSvg />
            </View>
            <View style={{ position: "absolute", top: "50%", paddingHorizontal: 25 }}>
                <Text style={styles.title}>Book </Text>
                <Text style={styles.title}>Online</Text>
                <View>
                    <Text style={styles.subTitle}>LUGBEE allows you to find the right store for your luggage storage from a network of exclusive luggage store options. Make the bookings by entering simple details of your order. Enter date, time and the closest store on your trip to complete the booking. </Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        ...HeavyTextStyle,
        color: colors.secondary,
        // maxWidth: 100
    },
    subTitle: {
        ...commonTextStyle,
        color: colors.white,
        paddingTop: 10,
        maxWidth: "90%",
    }
})

export default Screen1