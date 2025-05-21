import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { commonTextStyle, HeavyTextStyle, primaryColorBackground } from '../../styles/CommonStyling'
import { ThirdScreenSvg } from '../../assets/svg/splash/OnBoardingSvgs'
import { colors } from '../../styles/color'



const Screen3 = () => {

    return (
        <View style={{ ...primaryColorBackground, }}>
            <View style={{ position: "absolute", transform: [{ scale: 0.8, }], top: -150, right: 80 }}>
                <ThirdScreenSvg />
            </View>
            <View style={{ position: "absolute", top: "50%", paddingHorizontal: 25 }}>
                <Text allowFontScaling={false} style={styles.title}>Enjoy the city</Text>
                <Text allowFontScaling={false} style={styles.title}>Hassle-Free</Text>
                <View>
                    <Text allowFontScaling={false} style={styles.subTitle}>You are ready to explore the city and enjoy the adventures without worrying about the heavy luggage you were carrying. Get your luggage back without any issues and complete the journey without any interruptions. </Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        ...HeavyTextStyle,
        color: colors.secondary,
        // maxWidth: 180
    },
    subTitle: {
        ...commonTextStyle,
        color: colors.white,
        paddingTop: 10,
        maxWidth: "90%",
    }
})

export default Screen3