import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { flexCenter, LargeTextStyle, primaryColorBackground } from '../styles/CommonStyling';
import { AsyncLogin } from '../store/actions/UserAction';
import { connect } from 'react-redux';
import { AppName } from '../components/custom/CustomFields';
import { AppNameSvg, BuubleBackgroundSvg, LayerRibbonSvg } from '../assets/svg/splash/SplashSvgs';


const SplashScreen = ({ AsyncLogin }) => {

    useEffect(() => {
        setTimeout(() => {
            AsyncLogin();
        }, 2000);
    }, []);


    return (
        <View style={styles.container}>
            <AppName />
            <View style={{ position: "absolute", bottom: -80, left: -160 }}>
                <LayerRibbonSvg />
            </View>
            <Image source={require("../assets/images/Bag.png")} style={{ position: "absolute", top: -30, right: -30, transform: [{ scale: 0.9 }] }} />
            <View style={{ position: "absolute", bottom: 0 }}>
                <BuubleBackgroundSvg />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        ...flexCenter,
        ...primaryColorBackground
    }
})

export default connect(undefined, { AsyncLogin })(SplashScreen);
