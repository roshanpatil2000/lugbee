import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { commonTextStyle, HeavyTextStyle, primaryColorBackground } from '../../styles/CommonStyling'
import { SecondScreenSvg } from '../../assets/svg/splash/OnBoardingSvgs'
import { screenWidth } from '../../styles/ResponsiveLayout'
import { colors } from '../../styles/color'



const Screen2 = () => {
    return (
        <View style={{ ...primaryColorBackground, width: screenWidth }}>
            <View style={{ position: "absolute", transform: [{ scale: 0.8, }], right: -screenWidth + 40, top: -160, overflow: "hidden" }}>
                <SecondScreenSvg />
            </View>
            <View style={{ position: "absolute", top: "50%", paddingHorizontal: 25 }}>
                <Text allowFontScaling={false} style={styles.title}>Drop Your</Text>
                <Text allowFontScaling={false} style={styles.title}>Luggage</Text>
                <View>
                    <Text allowFontScaling={false} style={styles.subTitle}>Once your booking is done, its time to leave the luggage in the safe hands of store managers. Stay stress-free with reliable storage options. Don't forget to show your identity proof while leaving the luggage at the store. </Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        ...HeavyTextStyle,
        color: colors.secondary,
        // maxWidth: 150
    },
    subTitle: {
        ...commonTextStyle,
        color: colors.white,
        paddingTop: 10,
        maxWidth: "90%",
    }
})

export default Screen2