import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-toast-message';
import { Button, InputField, Loader } from '../custom/CustomFields';
import { colors } from '../../styles/color';
import { getAddressByLatLng, getCurrentLatLng } from '../../constants/GeoLocation';
import CountryCode from '../../constants/CountryCode';
import { commonTextStyle, largeMediumStyle } from '../../styles/CommonStyling';
import CountryCodeModal from './CountryCodeModal';
import OtpComponent from '../Auth/OtpComponent';
import { editUserProfile, getUserProfile, sendOtpToVerfiy, verifyOtp } from '../../store/actions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppConst, BaseValidation } from '../../constants/AppConst';
import AlertHeader from '../custom/AlertHeader';
import { env } from '../../services/service';


const VerificationModal = ({ close, verifyType = "Email", editScreen = false }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedCode, setSelectedCode] = React.useState("");
    const [field, setField] = React.useState('');
    const [error, setError] = React.useState('');
    const [codeModal, setCodeModal] = React.useState(false);
    const [otpSession, setOtpSession] = React.useState('');
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [currentAddress, setCurrentAddress] = React.useState('');
    const [otp, setotp] = useState({
        first: '',
        second: '',
        third: '',
        four: '',
        five: '',
        six: '',
    });

    const dispatch = useDispatch();
    const profile = useSelector(state => state.user.userDetail);


    useEffect(() => {
        if (verifyType == "Mobile") {

            getCoords()
        }
    }, []);
    const getCoords = () => {
        setIsLoading(true);
        getCurrentLatLng(true, res => {
            console.log('res', res);
            if (res) {
                const coord = {
                    latitude: res.lat,
                    longitude: res.lng,
                };
                // setCurrentCoords(coord);
                // setCurrentCoords({
                //     latitude: Number(res.lat).toFixed(7),
                //     longitude: Number(res.lng).toFixed(7),
                // });

                getAddressByApi(res.lat, res.lng);
            } else {
                setIsLoading(false);
                setSelectedCode('+91');
            }
        });
    };

    const getAddressByApi = async (lat, lng) => {
        console.log('lat', lat, 'lng', lng);
        // setActivity(true);
        const addrs = await getAddressByLatLng({ lat, lng });
        setIsLoading(false);
        if (addrs) {
            console.log('addrs---', addrs);
            // setAddress(addrs.formatted_address);
            setCurrentAddress({
                address: addrs.address.city + ", " + addrs.address.state + ", " + addrs.address.country,
                lat: lat,
                lng: lng,
                city: addrs.address.city,
                country: addrs.address.country,
            });
            CountryCode.map(item => {
                if (item.name === addrs.address.country) {
                    setSelectedCode(item.dial_code);
                }
            });
        } else {
            setSelectedCode('+91');
        }
    };

    const onVerify = () => {
        console.log(field)
        if ((!profile.first_name && !firstname.trim()) || (!profile.last_name && !lastname.trim()) || editScreen) {
            Toast.show({
                text1: "Please enter first and last name",
                type: "error",
                position: "top",
            });
            return;
        }

        if (verifyType == "Name") {
            updateProfile()
            return;
        }

        if (verifyType == "Mobile" && field.trim() == "" || (verifyType == "Mobile" && field.trim().length < 10)) {
            setError("Please enter valid mobile number");
            return;
        }

        if ((verifyType == "Email" && field.trim() == "") || (verifyType == "Email" && !BaseValidation.email.test(field) && env !== "dev")) {
            setError("Please enter valid email");
            return
        }

        let dt = {
            field: field,
            countryCode: selectedCode.includes('+') ? selectedCode.replace('+', '') : '',
            firstName: profile.first_name ? profile.first_name : firstname,
            lastName: profile.last_name ? profile.last_name : lastname,
        }
        setIsLoading(true);
        sendOtpToVerfiy(dt, verifyType == "Email" ? false : true).then(res => {
            setIsLoading(false);
            console.log("screen res:", res);
            if (res?.status == 200) {
                dispatch(getUserProfile(currentAddress));
                setOtpSession(res.data.otp_session_id);
                return;
            }
            Toast.show({
                type: "error",
                position: 'top',
                text1: res.message,
            })
        })
    }

    const onOtpSubmit = () => {
        if (otp.first && otp.second && otp.third && otp.four && otp.five && otp.six) {
            setIsLoading(true);
            let otpString = otp.first + otp.second + otp.third + otp.four + otp.five + otp.six;

            verifyOtp(otpString, otpSession).then(res => {
                if (res?.status == 200) {
                    dispatch(getUserProfile(currentAddress));
                    setIsLoading(false);
                    close();
                    return;
                }
                setIsLoading(false);
                Toast.show({
                    type: "error",
                    position: 'top',
                    text1: res.message,
                })
            })
        }
    }

    const updateProfile = () => {
        let data = {
            ...profile,
            first_name: profile.first_name ? profile.first_name : firstname,
            last_name: profile.last_name ? profile.last_name : lastname,
            firstName: profile.first_name ? profile.first_name : firstname,
            lastName: profile.last_name ? profile.last_name : lastname,
            email: verifyType == "Email" ? field : profile.email_id,  //email,
            mobile: verifyType == "Mobile" ? field : profile.mobile_no.toString(),//phone,
            countryCode: verifyType == "Mobile" ? CountryCode.replace('+', '') : profile.mobile_country_code,
            address: profile.currentAddress,
            isPromotion: profile.is_promotion,
            goback: false
        }

        console.log('data', data)
        // return;
        dispatch(editUserProfile(data, profile));
        dispatch(getUserProfile(currentAddress));
        setIsLoading(false);
        close()
    }
    // console.log("---otp_session---", profile);
    return (
        <Modal
            visible
            onRequestClose={() => close()}
            transparent
            animationType="fade"
        >
            <TouchableOpacity style={styles.container} activeOpacity={1} >
                <View style={styles.modal}>
                    {/* <AntDesign name='close' size={25} color={colors.black} onPress={() => close()} style={{ position: "absolute", right: 0, padding: 10, zIndex: 1 }} /> */}
                    {!otpSession ?
                        <View>
                            {/* <Text style={styles.headtxt}>Verify your {verifyType}</Text> */}
                            <AlertHeader
                                title={verifyType == "Name" ? "Please provide your name" : `Verify your ${verifyType}`}
                            />

                            {(!profile.first_name || !profile.last_name) && !editScreen ?
                                <View>
                                    <InputField
                                        placeholder="First Name"
                                        value={firstname}
                                        style={{ marginTop: 20 }}
                                        onTextChange={(text) => setFirstName(text)}
                                    />
                                    <InputField
                                        placeholder="Last Name"
                                        value={lastname}
                                        // style={{ borderRadius: 50 }}
                                        onTextChange={(text) => setLastName(text)}
                                    />
                                </View>
                                : null
                            }
                            {(verifyType == "Mobile" || verifyType == "Email") &&
                                <InputField
                                    value={field}
                                    placeholder={verifyType}
                                    placeholderTextColor={colors.grey}
                                    // style={styles.LoginInput}
                                    maxLength={verifyType == "Email" ? 50 : 11}
                                    onTextChange={text => {
                                        setField(text);
                                    }}
                                    onFocus={() => (error ? setError('') : null)}
                                    error={error}
                                    style={{ backgroundColor: colors.white, marginTop: profile.first_name ? 30 : 10, }}
                                    activeBorderColor={colors.primary}
                                    textStyle={{ color: colors.black }}
                                    keyboardType={verifyType == "Email" ? "email-address" : "numeric"}
                                    showIcon={() =>
                                        verifyType == "Mobile" ? (
                                            <>
                                                <TouchableOpacity
                                                    onPress={() => setCodeModal(true)}
                                                    style={{
                                                        justifyContent: 'center',
                                                        padding: 7,
                                                        paddingLeft: 0,
                                                        borderRightWidth: 0.5,
                                                        borderColor: colors.grey,
                                                    }}>
                                                    <Text style={styles.txt}>{selectedCode}</Text>
                                                </TouchableOpacity>
                                            </>
                                        ) : null
                                    }
                                />
                            }
                            <View style={{ marginTop: 20 }}>
                                <Button
                                    title={verifyType == "Name" ? "Save" : 'Verify'}
                                    onPress={() => onVerify()}
                                />

                            </View>
                        </View>
                        :
                        <View>
                            <AlertHeader
                                title={`Enter six digit OTP`}
                            />
                            <View style={{ marginTop: 30 }}>
                                <OtpComponent
                                    otp={otp}
                                    setotp={setotp}
                                    theme="light"
                                    resendPress={() => onVerify()}
                                    isVerify={true}
                                />
                            </View>
                            <View>
                                <Button
                                    title='Submit OTP'
                                    onPress={() => onOtpSubmit()}
                                />
                            </View>
                        </View>
                    }
                    <Button
                        title="Cancel"
                        backgroundColor={colors.white}
                        style={{ borderWidth: 1, borderColor: colors.primary }}
                        onPress={() => close()}
                    />

                    {isLoading && <Loader />}
                </View>
                {codeModal &&
                    <CountryCodeModal
                        close={() => setCodeModal(false)}
                        onSelect={code => {
                            setSelectedCode(code.dial_code);
                            setCodeModal(false);
                        }}
                    />
                }
            </TouchableOpacity>

        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        zIndex: -1
    },
    modal: {
        backgroundColor: '#fff',
        // padding: 20,
        borderRadius: 20,
        marginHorizontal: 15,
        zIndex: 999,
        paddingBottom: 10
    },
    headtxt: {
        ...largeMediumStyle,
        textAlign: "center"
    },
    txt: {
        ...commonTextStyle,

    }
})

export default VerificationModal