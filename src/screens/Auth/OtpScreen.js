import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { colors } from '../../styles/color';
import OtpComponent from '../../components/Auth/OtpComponent';
import {
    fontSize,
    largeMediumStyle,
    LargeTextStyle,
    MediumTextStyle,
} from '../../styles/CommonStyling';
import { BubbleTopToBottom } from '../../assets/svg/splash/SplashSvgs';
import { AppName, Button, Loader } from '../../components/custom/CustomFields';
import { goBack, pop } from '../../route/RootNavigation';
import { useDispatch } from 'react-redux';
import { changeAppStatus, saveUserDeviceTokenAction, userLogin, userSignup } from '../../store/actions/UserAction';
import { AppConst } from '../../constants/AppConst';

const OtpScreen = ({ route }) => {
    const d = route.params?.details;
    const [detail, setDetail] = useState(d);
    const [otp, setotp] = useState({
        first: '',
        second: '',
        third: '',
        four: '',
        five: '',
        six: '',
    });
    const firstRef = useRef();
    const secondRef = useRef();
    const thirdRef = useRef();
    const fourRef = useRef();
    const dispatch = useDispatch();
    const [activity, setActivity] = useState(false);

    // useEffect(() => {
    //     setActivity(false)
    // }, [])

    const onVerify = () => {
        if (otp.first && otp.second && otp.third && otp.four && otp.five && otp.six) {
            setActivity(true);
            let otpString = otp.first + otp.second + otp.third + otp.four + otp.five + otp.six
            userLogin(otpString, detail).then(res => {
                if (res.status == 200) {
                    saveUserDeviceTokenAction().then(res2 => {
                        AppConst.showConsoleLog("dvice token save res: ", res2)
                        setActivity(false)
                        if (d.fromScreen = "booking") {
                            pop(2);
                        }
                        dispatch(changeAppStatus(3));
                    })
                }
            })
        } else {
            // alert('Please enter valid OTP');
        }
    };

    const onResendPress = () => {

        setActivity(true);
        userSignup(detail, detail.isMobile).then(res => {
            setActivity(false);
            if (res.status == 200) {
                setDetail({ ...detail, otp_session_id: res.data.otp_session_id, account_id: res.data.account_id });
                return res
                // navigate('otpScreen')
            }
        })
    }

    // console.log('detail', AppConst.authToken);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            // behavior='padding'
            style={{
                flex: 1,
                backgroundColor: colors.primary,
            }}>
            <ScrollView contentContainerStyle={{}} style={{ flex: 1, }} keyboardShouldPersistTaps="handled">
                <View style={{ position: 'absolute' }}>
                    <BubbleTopToBottom />
                </View>
                <View style={{ padding: 20 }}>
                    <AppName />
                </View>

                <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', paddingVertical: 20, paddingTop: 50 }}>
                    <View
                        style={[
                            { marginBottom: 20, marginHorizontal: 20 },
                        ]}>
                        <Text style={styles.txt}>Enter the six digit code sent</Text>
                        <Text style={styles.txt}>
                            <Text>to you at</Text>
                            <Text style={{ color: colors.secondary, }}> {detail?.isMobile ? "+" + detail.countryCode + " " + detail.mobile : detail.email}</Text>
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <OtpComponent
                            otp={otp}
                            setotp={setotp}
                            // resendPress={() => onResendPress()}
                            detail={detail}
                            setDetail={setDetail}
                            setActivity={setActivity}
                        />
                    </View>

                </View>
            </ScrollView>
            <View style={{ width: "90%", alignSelf: "center", paddingBottom: Platform.OS == "ios" ? 40 : 10 }}>
                <Text style={styles.optntxt} onPress={() => goBack()}>
                    Change {detail?.isMobile ? "Mobile Number" : "Email Id"}
                </Text>
                <Button title="Verify" onPress={() => onVerify()} />
            </View>
            {activity && <Loader />}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    otp: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: colors.yellow,
        marginHorizontal: 10,
        borderRadius: 5,
        width: 50,
    },
    optntxt: {
        ...MediumTextStyle,
        fontWeight: '600',
        color: colors.secondary,
        padding: 20,
        textAlign: 'center',
    },
    txt: {
        ...largeMediumStyle,
        color: colors.white,
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0.5,
    }
});

export default OtpScreen;
