import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Toast from 'react-native-toast-message';
import { colors } from '../../styles/color'
import { useDispatch, useSelector } from 'react-redux'
import { noImage } from '../../constants/AppConst'
import { Button, Checkbox, InputField, Loader, TouchableTextView } from '../../components/custom/CustomFields'
import { goBack, pop } from '../../route/RootNavigation'
import CountryCodeModal from '../../components/Modals/CountryCodeModal'
import { getAddressByLatLng, getCurrentLatLng } from '../../constants/GeoLocation'
import CountryCode from '../../constants/CountryCode'
import { editUserImage, editUserProfile } from '../../store/actions/UserAction'
import { commonTextStyle, fonts } from '../../styles/CommonStyling';
import VerificationModal from '../../components/Modals/VerificationModal';
import { DrawerScreenOptions } from '../../route/StackNavigation';



const SettingScreen = ({ navigation }) => {
    const userProfile = useSelector(state => state.user.userDetail);
    const [firstname, setFirstName] = useState(userProfile?.first_name ? userProfile.first_name : '');
    const [lastname, setLastName] = useState(userProfile?.last_name ? userProfile.last_name : '');
    const [email, setEmail] = useState(userProfile?.email_id ? userProfile.email_id : '');
    const [phone, setPhone] = useState(userProfile?.mobile_no ? userProfile.mobile_no.toString() : '');
    const [image, setImage] = useState(userProfile?.profile_image_path ? userProfile.profile_image_path : null);
    const [mobileCode, setMobileCode] = useState(userProfile?.mobile_country_code ? "+" + userProfile.mobile_country_code : '');
    const [codeModal, setCodeModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [promotionCheck, setPromotionCheck] = useState(userProfile?.is_promotion ? true : false);
    const dispatch = useDispatch();

    const VerifyIcon = <AntDesign name='checkcircle' size={20} color={colors.green} />
    const UnVerifyIcon = <Entypo name='warning' size={20} color={colors.yellow} />


    useEffect(() => {
        if (!userProfile?.mobile_no || !userProfile.mobile_country_code)
            getCoords()
    }, []);

    useEffect(() => {
        navigation.setOptions({
            ...DrawerScreenOptions({ navigation: navigation })
        })
    }, [navigation]);

    const getCoords = () => {
        getCurrentLatLng(true, res => {
            console.log('res', res);
            if (res) {
                getAddressByApi(res.lat, res.lng);
            }
        });
    };

    const getAddressByApi = async (lat, lng) => {
        console.log('lat', lat, 'lng', lng);
        // setActivity(true);
        const addrs = await getAddressByLatLng({ lat, lng });
        if (addrs) {
            console.log('addrs---', addrs);
            setCurrentAddress({
                address: addrs.address.city + ", " + addrs.address.state + ", " + addrs.address.country,
                lat: lat,
                lng: lng,
                city: addrs.address.city,
                country: addrs.address.country,
            });
            // setAddress(addrs.formatted_address);
            CountryCode.map(item => {
                if (item.name === addrs.address.country) {
                    setMobileCode(item.dial_code);
                }
            });
        }
    };

    const selectImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            setImage(image.path);
            saveImage({
                uri: image.path,
                name: new Date().getTime().toString() + '.jpg',
                type: image.mime
            })
        }).catch(err => {
        });
    }

    const saveImage = (image) => {
        // console.log(image)
        dispatch(editUserImage(image, userProfile));
    }

    const onSavePress = () => {

        if (!userProfile?.mobile_no_isverify) {
            Toast.show({
                type: "error",
                position: 'top',
                text1: "Please verfiy your mobile number",
            })
            return;
        }

        // if (!userProfile?.email_id_isverify) {
        //     Toast.show({
        //         type: "error",
        //         position: 'top',
        //         text1: "Please verfiy your email id",
        //     })
        //     return;
        // }
        if (!firstname.trim() || !lastname.trim()) {
            Toast.show({
                type: "error",
                position: 'top',
                text1: "First name and Last name are required",
            })
            // goBack();
            return;
        }
        // if (firstname == userProfile.first_name && lastname == userProfile.last_name && image == userProfile.profile_image_path) {
        //     return;
        // }
        // console.log('is image same: ', image == userProfile.profile_image_path);
        let data = {
            firstName: firstname,
            lastName: lastname,
            email: userProfile?.email_id ? userProfile.email_id : '',//email,
            mobile: userProfile?.mobile_no ? userProfile.mobile_no.toString() : '',//phone,
            countryCode: mobileCode.replace('+', ''),
            address: {
                country: userProfile?.currentAddress?.country ? userProfile?.currentAddress?.country : currentAddress?.country,
                city: userProfile?.currentAddress?.city ? userProfile?.currentAddress?.city : currentAddress?.city,
            },
            isPromotion: promotionCheck ? 1 : 0,
            goback: true
        }
        dispatch(editUserProfile(data, userProfile));

    }

    // console.log(userProfile);

    return (
        <View style={styles.container}>

            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity style={styles.imgView} onPress={() => selectImage()}>
                    <Image source={{ uri: image ? image : noImage }} style={styles.img} />
                    <View style={styles.imgEdit}>
                        <AntDesign name='edit' size={20} color={colors.primary} />
                    </View>
                </TouchableOpacity>
                <InputField
                    placeholder="First Name"
                    value={firstname}
                    style={{ borderRadius: 50 }}
                    onTextChange={(text) => setFirstName(text)}
                />
                <InputField
                    placeholder="Last Name"
                    value={lastname}
                    style={{ borderRadius: 50 }}
                    onTextChange={(text) => setLastName(text)}
                />
                <TouchableTextView
                    placeholder={"Email"}
                    value={userProfile?.email_id ? userProfile.email_id : ''}
                    leftIcon={userProfile?.email_id_isverify ? VerifyIcon : UnVerifyIcon}
                    style={{ borderRadius: 50 }}
                    touchable={userProfile?.email_id_isverify ? false : true}
                    onPress={() => setVerifyModal("Email")}
                />
                <TouchableTextView
                    placeholder={"Mobile Number"}
                    value={userProfile?.mobile_no ? userProfile?.mobile_no.toString() : ''}
                    leftIcon={userProfile?.mobile_no_isverify ? VerifyIcon : UnVerifyIcon}
                    style={{ borderRadius: 50 }}
                    onPress={() => setVerifyModal("Mobile")}
                    touchable={userProfile?.mobile_no_isverify ? false : true}
                    Icon={<>
                        <TouchableOpacity
                            onPress={() => userProfile?.mobile_no_isverify ? null : setCodeModal(true)}
                            style={{
                                justifyContent: 'center',
                                padding: 7,
                                paddingLeft: 0,
                                borderRightWidth: 0.5,
                                borderColor: colors.grey,
                            }}>
                            <Text style={styles.txt}>{mobileCode}</Text>
                        </TouchableOpacity>
                    </>
                    }
                />

                <View style={{ flexDirection: "row", padding: 10, paddingHorizontal: 20 }}>
                    <Checkbox
                        value={promotionCheck}
                        onPress={() => setPromotionCheck(!promotionCheck)}
                    />
                    <Text style={[styles.infotxt, { marginLeft: 10 }]}>Get emails for latest travel updates, new exciting offers, discounts, promotion, and more!</Text>
                </View>


                <View style={{ paddingTop: 30, paddingBottom: 20 }}>
                    <Button
                        title="Cancel"
                        backgroundColor={colors.white}
                        style={{ borderWidth: 1, borderColor: colors.primary }}
                        onPress={() => goBack()}
                    />
                    <Button
                        title="Save"
                        onPress={() => onSavePress()}
                    />
                </View>
            </ScrollView>


            {verifyModal &&
                <VerificationModal
                    close={() => setVerifyModal(false)}
                    verifyType={verifyModal}
                    editScreen={true}
                />
            }

            {codeModal &&
                <CountryCodeModal
                    close={() => setCodeModal(false)}
                    onSelect={code => {
                        setMobileCode(code.dial_code);
                        setCodeModal(false);
                    }}
                />
            }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    imgView: {
        marginVertical: 20,
        alignSelf: "center",
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.grey
    },
    imgEdit: {
        padding: 5,
        backgroundColor: colors.white,
        borderRadius: 50,
        position: "absolute",
        top: "60%",
        right: 0,
        borderWidth: 1,
        borderColor: colors.grey
    },
    txt: {
        ...commonTextStyle
    },
    infotxt: {
        fontSize: 12,
        fontFamily: fonts.light,
        color: colors.black,
        // textAlign: "center",
        lineHeight: 16,
        flex: 1
    },
})

export default SettingScreen