import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from 'react-native'
import { commonTextStyle, largeMediumStyle, MediumTextStyle, primaryColorBackground, smallTextSize } from '../../styles/CommonStyling'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../styles/color';
import { useDispatch, useSelector } from 'react-redux';
import { changeAppStatus, userLogout } from '../../store/actions/UserAction';
import { Button, CustomBackButton, Loader } from '../custom/CustomFields';
import { navigate, popToTop } from '../../route/RootNavigation';
import { DrawerActions, useNavigationState } from '@react-navigation/native';
import { AppConst, noImage } from '../../constants/AppConst';
import { buildNumber, setIsHome, versionNumber } from '../../store/actions/AppAction';
import { screenWidth } from '../../styles/ResponsiveLayout';
import AboutModal from '../Modals/AboutModal';
import LoginAlertModal from '../Modals/LoginAlertModal';


const DrawerContainer = ({ navigation }) => {
    const dispatch = useDispatch();
    const [activity, setActivity] = React.useState(false);
    const userProfile = useSelector(state => state.user.userDetail)
    const isHome = useSelector(state => state.app.isHome)
    const appversionData = useSelector(state => state.app.AppVersionData)
    const [about, setAbout] = React.useState(false);
    const [loginModal, setLoginModal] = React.useState(false);
    // console.log('DrawerContainer', appversionData)

    const options = [
        {
            name: "Home",
            key: "home",
            icon: <AntDesign name="home" size={24} color={colors.secondary} />
        },
        {
            name: "Bookings",
            key: "myBookings",
            icon: <AntDesign name="calendar" size={24} color={colors.secondary} />
        },
        {
            name: "Credits",
            key: "userCredits",
            icon: <FontAwesome5 name="coins" size={24} color={colors.secondary} />
        },
        {
            name: "Review",
            key: "Reviews",
            icon: <Feather name="star" size={24} color={colors.secondary} />
        },
        {
            name: "Settings",
            key: `${AppConst.accessToken ? "settings" : ""}`,
            icon: <AntDesign name="setting" size={24} color={colors.secondary} />
        },
        {
            name: "About",
            key: "about",
            icon: <AntDesign name="infocirlceo" size={24} color={colors.secondary} />
        },
        {
            name: "Logout",
            key: `${AppConst.accessToken ? "logout" : ""}`,
            icon: <MaterialCommunityIcons name="logout" size={24} color={colors.secondary} />
        }
    ]

    const onOptionPress = (item) => {
        try {



            if (!item.key) {
                return;
            }

            if (item.key == 'about') {
                setAbout(true);
                return;
            }

            if (item.key == "home") {
                !isHome ? popToTop() : null;
                navigation?.dispatch(DrawerActions.closeDrawer())
                if (!isHome) {
                    dispatch(setIsHome(true))
                }
                return;
            }

            if (!AppConst.accessToken) {
                setLoginModal(true);
                return;
            }

            if (item.key == "logout") {
                Alert.alert(
                    "Logout",
                    "Are you sure you want to logout?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "Logout", onPress: () => {
                                dispatch(userLogout())
                            }, style: "destructive"
                        }
                    ]
                );
                return;
            }

            dispatch(setIsHome(false));
            navigate(item.key)
            navigation?.dispatch(DrawerActions.closeDrawer())
        } catch (error) {
            AppConst.showConsoleLog(error)
        }
    }

    const onLoginPress = () => {
        dispatch(changeAppStatus(2));
    }

    const Footer = () => (
        <View style={styles.footer}>
            <Text style={{ ...smallTextSize, color: colors.darkGrey, textAlign: "center" }}>Version {versionNumber} ({buildNumber})</Text>
        </View>
    )

    // console.log("userProfile Image", userProfile?.profile_image_path);

    return (
        <View style={styles.container}>

            <View style={styles.hdrView}>
                <View style={{ flex: 1, }}>
                    <CustomBackButton style={{ marginLeft: 10 }} onPress={() => navigation.dispatch(DrawerActions.closeDrawer())} />
                    <View style={{ alignSelf: "center", alignItems: "center", paddingBottom: 10 }}>
                        {userProfile?.profile_image_path ?
                            <Image source={{ uri: userProfile?.profile_image_path }} style={styles.img} />
                            :
                            <FontAwesome5 name='user-circle' size={50} color={colors.secondary} style={{ marginBottom: 10 }} />
                        }
                        <Text style={[styles.hvytxt, { maxWidth: screenWidth - 100, marginBottom: 5 }]}>{userProfile?.first_name ? userProfile?.first_name + `${userProfile?.last_name ? " " + userProfile?.last_name : ""}` : userProfile?.email_id ? userProfile.email_id : userProfile?.mobile_no}</Text>
                        {userProfile?.first_name && userProfile?.email_id &&
                            <Text style={{ ...commonTextStyle, color: colors.grey }}>{userProfile.email_id}</Text>
                        }
                        {!AppConst.accessToken &&
                            <TouchableOpacity style={styles.btn} onPress={() => onLoginPress()}>
                                <Text style={{ ...commonTextStyle, color: colors.white }}>Login</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>

            <View style={styles.optnContainer}>
                <FlatList
                    data={options}
                    keyExtractor={(item, index) => String(index)}
                    contentContainerStyle={{ paddingVertical: 20, }}
                    ListFooterComponent={<Footer style={{ height: 20 }} />}
                    renderItem={({ item }) => {
                        return (
                            <>
                                {item.key ? <TouchableOpacity
                                    onPress={() => onOptionPress(item)}
                                    style={styles.option}
                                >
                                    {item.icon}
                                    <Text style={styles.optionTxt}>{item.name}</Text>
                                    <AntDesign name="right" size={16} color={colors.grey} style={styles.arrow} />
                                </TouchableOpacity>
                                    : null}
                            </>
                        )
                    }}
                />
            </View>
            {activity && <Loader />}

            {about &&
                <AboutModal
                    close={() => setAbout(false)}
                />
            }
            {loginModal &&
                <LoginAlertModal
                    close={() => setLoginModal(false)}
                />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary
    },
    hdrView: {
        flexDirection: 'row',
        padding: 10,
        // borderBottomWidth: 0.5,
        // borderColor: colors.grey,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15
    },
    hvytxt: {
        ...MediumTextStyle,
        color: colors.white
    },
    optnContainer: {
        backgroundColor: colors.white,
        flex: 1,
        borderTopLeftRadius: 55,
        borderTopRightRadius: 55,
        // paddingVertical: 20
    },
    option: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: 'grey',
        paddingVertical: 15,
        alignItems: "center",
        paddingHorizontal: 25
    },
    optionTxt: {
        ...MediumTextStyle,
        color: colors.primary,
        marginLeft: 20,
        flex: 1
    },
    img: {
        height: 80,
        width: 80,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.secondary,
        marginBottom: 10
    },
    footer: {
        padding: 15,
    },
    arrow: {
        position: "absolute",
        right: 25,
    },
    btn: {
        backgroundColor: colors.secondary,
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 20
    }
})

export default DrawerContainer