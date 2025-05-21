import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { AccessToken, AuthenticationToken, LoginManager, Profile } from "react-native-fbsdk-next";
import { FacebookIconSvg, GoogleIconSvg } from '../../assets/svg/basic/basiciconSvg'
import { colors } from '../../styles/color'
import { fonts, fontSize } from '../../styles/CommonStyling'
import { changeAppStatus, getFacebookUserData, userLogin } from '../../store/actions/UserAction';
import { useDispatch } from 'react-redux';
import { Loader } from '../custom/CustomFields';
import { setLoader } from '../../store/actions/AppAction';
import { AppConst } from '../../constants/AppConst';




const SocialLoginOptions = ({ avalableType }) => {
    const dispatch = useDispatch();

    AppConst.showConsoleLog('SocialLoginOptions', avalableType)

    const googlePress = async () => {
        // if (Platform.OS === 'ios') {
        //     return;
        // }
        try {
            GoogleSignin.configure({
                androidClientId: '572723525144-uhc7i371sc0ikudr4cve7aucs0a65bv9.apps.googleusercontent.com',
                offlineAccess: true,
                webClientId: '572723525144-l0fl5hiclt95gn8tghnh0mlf8iaac1lt.apps.googleusercontent.com',
                iosClientId: "572723525144-01lh3i24bii9cbtaq88p17ml6ac17sg1.apps.googleusercontent.com",
                // iosClientId: "1008850210985-qrvrldprssf7vkiu89ctll6qkj4o0i18.apps.googleusercontent.com"
            });
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            let apiData = {
                email: userInfo.user.email,
                auth_type: 'google',
                oAuthToken: userInfo.idToken,
            }
            // alert(userInfo.user.email)
            loginFunc(apiData);
            return userInfo;
            // this.setState({ userInfo });
        } catch (error) {
            // alert(error.message);
            console.log(error);
            return error;
        }
    }


    const fbLogin = async () => {
        // if (Platform.OS === 'ios') {
        //     return;
        // }
        try {
            const loginPermission = await LoginManager.logInWithPermissions(['public_profile', 'email', 'user_friends']);
            if (loginPermission.isCancelled) {
                console.log("Login cancelled");
            }
            else {
                console.log("Login success with permissions: " + loginPermission.grantedPermissions.toString());
                const currentProfile = await Profile.getCurrentProfile();
                let token = await AccessToken.getCurrentAccessToken();
                // if (Platform.OS === 'ios') {
                //     let result = await AuthenticationToken.getAuthenticationTokenIOS();
                //     token = result?.authenticationToken;
                //     // console.log(result?.authenticationToken);
                // } else {
                let result = await AccessToken.getCurrentAccessToken();
                token = result?.accessToken;
                // console.log(result);
                // }
                let fbResponse = await getFacebookUserData(token);
                console.log("currentProfile--", fbResponse);
                console.log("token--", token)
                let apiData = {
                    email: currentProfile.email ? currentProfile.email : fbResponse.email,
                    auth_type: 'fb',
                    oAuthToken: token,
                }
                loginFunc(apiData);
            }
        } catch (error) {
            console.log(error)
        }
    }





    const applePress = async () => {
        if (Platform.OS == "ios") {
            // performs login request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            // get current authentication state for user
            // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

            // use credentialState response to ensure the user is authenticated
            if (credentialState === appleAuth.State.AUTHORIZED) {
                console.log('User is authenticated', appleAuthRequestResponse);

                // user is authenticated
            }
        }
    }


    const loginFunc = (data) => {
        dispatch(setLoader(true));
        userLogin(null, data).then(res => {
            dispatch(setLoader(false));
            if (res?.status == 200) {
                dispatch(changeAppStatus(3));
            }
        });
    }

    return (
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
            {avalableType.apple?.login_type !== 0 &&
                <TouchableOpacity style={styles.iconRound} onPress={() => applePress()}>
                    <AntDesign name='apple1' size={20} color={colors.white} />
                    <Text style={styles.txt}>  Continue with Apple</Text>
                </TouchableOpacity>
            }
            {avalableType.google?.login_type !== 0 &&
                <TouchableOpacity onPress={() => googlePress()} style={[styles.iconView, {}]}>
                    <GoogleIconSvg />
                </TouchableOpacity>
            }
            {avalableType.fb?.login_type !== 0 &&
                <TouchableOpacity style={styles.iconView} onPress={() => fbLogin()}>
                    <FacebookIconSvg />
                </TouchableOpacity>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    iconView: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        // backgroundColor: colors.white,
        transform: [{ scale: 0.8 }],
        // marginHorizontal: 10,
        borderWidth: 0.5,
        borderColor: colors.white,
    },
    iconRound: {
        height: 45,
        width: 180,
        justifyContent: "center",
        // alignItems: "center",
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: colors.white,
        flexDirection: 'row',
        alignItems: "center",
        right: 8
    },
    txt: {
        fontSize: fontSize.small,
        fontFamily: fonts.light,
        color: colors.white,
    }
})


export default SocialLoginOptions