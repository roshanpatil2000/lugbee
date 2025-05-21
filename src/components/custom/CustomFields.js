import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LuggageSvg } from '../../assets/svg/basic/basiciconSvg';
import { AppNameSvg } from '../../assets/svg/splash/SplashSvgs';
import { colors } from '../../styles/color';
import { commonTextStyle, fonts, HeavyTextStyle, LargeTextStyle, smallTextSize } from '../../styles/CommonStyling';
import { screenHeight, screenWidth } from '../../styles/ResponsiveLayout';
import { shadows } from '../../styles/shadow';
import { goBack } from '../../route/RootNavigation';


export const InputField = ({ placeholder = "Password", value, onTextChange, onFocus = () => { }, onBlur = () => { }, showIcon, isDescription = false, error, password = false, style = {}, activeBorderColor, textStyle = {}, keyboardType = "default", maxLength = 50, leftIcon }) => {
    const [activeField, setActiveField] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(password);

    const inputPasswordWidth = activeField ? { borderWidth: 0.5, borderColor: activeBorderColor ? activeBorderColor : colors.primary } : { borderWidth: 0.5 };
    // console.log(secureTextEntry)
    return (
        <>
            <View
                style={[
                    styles.InputView,
                    inputPasswordWidth,
                    shadows[1],
                    isDescription ? { height: 150, } : { alignItems: "center" },
                    error ? { borderColor: colors.darkRed } : null,
                    style
                ]}
            >
                {showIcon && showIcon() && <View style={{}}>
                    {showIcon()}
                </View>}
                <TextInput
                    value={value}
                    onChangeText={(text) => onTextChange(text)}
                    placeholder={placeholder}
                    placeholderTextColor="gray"
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    secureTextEntry={secureTextEntry}
                    multiline={isDescription ? true : false}
                    onFocus={() => {
                        setActiveField(true)
                        onFocus()
                    }}
                    onBlur={() => {
                        setActiveField(false)
                        onBlur()
                    }}
                    style={[{
                        flex: 1,
                        // height: 50,
                        color: 'black',
                        ...commonTextStyle,
                        paddingLeft: showIcon && showIcon() ? 10 : 10,
                        textAlignVertical: isDescription ? "top" : "center",
                        ...textStyle
                    }]}
                />
                {leftIcon && leftIcon}
                {password && <Entypo name={secureTextEntry ? 'eye-with-line' : 'eye'} size={22} color={"black"} style={{ padding: 5 }} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
            </View>
            {error ? <Text style={[commonTextStyle, { color: colors.darkRed, paddingHorizontal: 25, top: -10 }]}>{error}</Text> : null}
        </>
    )
}

export const AppName = ({ scale = 1 }) => {
    return (
        <View style={{ transform: [{ scale: scale }] }}>
            <AppNameSvg />
        </View>
    )
}



export const Loader = ({ color = colors.primary, backgroundColor = "rgba(0,0,0,0.5)" }) => {
    return (
        <View style={[styles.loader, { backgroundColor: backgroundColor }]}>
            <ActivityIndicator size={"large"} color={color} style={styles.loaderC} />
        </View>
    )
}

export const Button = ({ title = "Login", onPress = () => { }, backgroundColor = colors.secondary, textStyle = {}, icon, style = {} }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: backgroundColor, ...style }]}
            onPress={() => onPress()}
        >
            {icon && icon}
            <Text style={[styles.buttonText, { ...textStyle }]}>{title}</Text>
        </TouchableOpacity>
    )
}


export const TouchableTextView = ({ placeholder, value, onPress = () => { }, Icon, leftIcon, style = {}, touchable }) => {
    console.log(touchable)
    return (
        <TouchableOpacity
            activeOpacity={touchable ? 0 : 1}
            style={[styles.InputView, shadows[1], { alignItems: "center" }, style]}
            onPress={() => touchable ? onPress() : null}
        >
            {Icon && Icon}
            <Text
                style={[
                    commonTextStyle,
                    { color: value ? colors.black : colors.grey, flex: 1, paddingLeft: 10 },
                ]}
            >{value ? value : placeholder}</Text>
            {leftIcon && leftIcon}
        </TouchableOpacity>
    )
}


export const Checkbox = ({ value = false, size = 20, backgroundColor = colors.primary, onPress = () => { } }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.checkbox, { backgroundColor: value ? backgroundColor : colors.white, height: size, width: size, borderColor: value ? colors.white : colors.primary }]}
        >
            {value &&
                <Entypo name='check' size={20} color={colors.white} />
            }
        </TouchableOpacity>
    )
}


export const CustomBackButton = ({ style = {}, onPress = () => goBack() }) => {
    return (
        <TouchableOpacity onPress={() => onPress()} style={[styles.headerIcon, style]}>
            <AntDesign name="arrowleft" color={colors.primary} size={25} style={{}} />
        </TouchableOpacity>
    )
}


export const AlertCloseIcon = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.closeIcon} onPress={() => onPress()}>
            <AntDesign name="close" size={30} color={colors.primary} />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    InputView: {
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: colors.grey,
        marginVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        // width: "100%",
        marginHorizontal: 20,
        alignSelf: 'center',
        height: 50,
        backgroundColor: colors.white

    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignSelf: 'center',
        marginVertical: 10,
        width: "90%",
        alignItems: 'center',
        flexDirection: 'row',
        maxHeight: 50,
        justifyContent: "center"
    },
    buttonText: {
        ...commonTextStyle,
        color: colors.primary,
        fontFamily: fonts.medium
    },
    loader: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1,
    },
    checkbox: {
        borderWidth: 0.5,
        borderColor: colors.primary,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        padding: 5,
        marginLeft: 20,
        backgroundColor: colors.secondary,
        borderRadius: 20,
        alignSelf: "flex-start"
    },
    closeIcon: {
        padding: 5,
        alignSelf: "center",
        borderRadius: 20,
        backgroundColor: colors.secondary,
        marginTop: 10
    },
    loaderC: {
        padding: 10,
        backgroundColor: colors.secondary,
        borderRadius: 10
    }
})