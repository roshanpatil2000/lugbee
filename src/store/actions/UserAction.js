import { Change_App_Status, setUserDetailType, setUserProfileType } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConst } from "../../constants/AppConst";
import { getUniqueId } from "../../constants/GlobalMethod";
import { apiHeader, AuthorizeApiHeader, createTransactionUri, FormDataApiHeader, FormDataAuthApiHeader, getAuthTokenUri, getCreditsUri, GetRequest, getReviewUri, getUserProfileUri, LoginTypeUri, loginUri, logoutUri, PostRequest, refreshBookingUri, removeFcmTokenUri, saveFcmTokenUri, sendOtpUri, signupUri, updateUserProfileUri, userImnageUploadUri, userPaymentChekoutUri, verifyOtpUri } from "../../services/service";
import { Platform } from "react-native";
import Toast from 'react-native-toast-message';
import { buildNumber, setLoader } from "./AppAction";
import { goBack, pop } from "../../route/RootNavigation";

export const changeAppStatus = (payload) => {
    return {
        type: Change_App_Status,
        payload
    }
}


export const setUserProfile = (payload) => {
    return {
        type: setUserDetailType,
        payload
    }
}



export const AsyncLogin = () => {
    return async dispatch => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const onBoarding = await AsyncStorage.getItem('OnBoarding');
            let clientId = await AsyncStorage.getItem('clientId');
            let accountId = await AsyncStorage.getItem('account_id');
            // let appBuild = await AsyncStorage.getItem('app_build');
            AppConst.showConsoleLog('async login token--', accessToken);
            AppConst.showConsoleLog('clientId --', clientId);
            AppConst.showConsoleLog('Account Id --', accountId);
            AppConst.showConsoleLog('Current Build Number --', AppConst.appBuild);

            if (clientId) {
                AppConst.setClientId(clientId);
            } else {
                let uniqueId = getUniqueId();
                AppConst.setClientId(uniqueId);
                await AsyncStorage.setItem('clientId', uniqueId);
            }
            if (accessToken) {
                AppConst.setAccessToken(accessToken);
                AppConst.setAccountId(JSON.parse(accountId));
                dispatch(changeAppStatus(3));
            } else {
                if (onBoarding) {
                    dispatch(changeAppStatus(2));
                    return;
                }
                AppConst.showConsoleLog('uniqueId:', getUniqueId());
                dispatch(changeAppStatus(1));
            }
        } catch (error) {
            console.log(error)
        }
    }
}


export const getUserAuthToken = async () => {
    try {
        let clientId = AppConst.clientId;
        let clientType = Platform.OS
        AppConst.showConsoleLog('clientId:', clientId);
        AppConst.showConsoleLog('clientType:', clientType);
        const formData = new FormData();
        formData.append('client_id', clientId);
        formData.append('client_type', clientType);
        formData.append('account_type', "user");
        const res = await PostRequest({
            url: getAuthTokenUri,
            body: formData,
            fileupload: true,
            method: "POST",
            header: FormDataApiHeader
        });
        AppConst.showConsoleLog("res:", res);
        if (res?.status == 200) {
            // AppConst.setUserToken(res.token);
            let token = JSON.stringify(res.data.token);
            AppConst.setAuthToken(token);
            // await AsyncStorage.setItem('auth_token', token);
            AppConst.showConsoleLog('token:', token);
            return res;
        }
        return false;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getAvailableLoginType = async () => {
    try {
        const res = await GetRequest({
            url: LoginTypeUri,
        });
        return res;
    } catch (error) {

    }
}

export const userSignup = async (detail, isMobile) => {
    let clientId = AppConst.clientId;
    let clientType = Platform.OS;
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_type', clientType);
    formData.append('auth_type', isMobile ? "mobile" : "email");
    formData.append('is_promotion', detail.promotion);
    isMobile ? formData.append('mobile_no', detail.mobile) : formData.append('email_id', detail.email);
    isMobile ? formData.append('mobile_country_code', detail.countryCode) : null;
    const res = await PostRequest({ url: signupUri, body: formData, fileupload: true, header: { ...FormDataAuthApiHeader, "Authorization": JSON.parse(AppConst.authToken) } });
    console.log('login res:', res);
    if (res?.status == 200) {
        let accountId = JSON.stringify(res.data?.account_id);
        AppConst.setAccountId(accountId);
        await AsyncStorage.setItem('account_id', accountId);
        AppConst.showConsoleLog("res:", res);
        return res;
    }
    Toast.show({
        type: "error",
        position: 'top',
        text1: res?.message ? res?.message : "Something went wrong",
    })
    return res;
}

export const userLogin = async (otp, detail) => {
    try {
        let clientId = AppConst.clientId;
        let clientType = Platform.OS;
        let field = otp && detail.isMobile ? "&mobile_no=" + detail.mobile : "&email_id=" + detail.email;
        let urlAddon = `?client_id=${clientId}&client_type=${clientType}&auth_type=${detail.isMobile ? "mobile" : "email"}${field}&otp_session_id=${detail.otp_session_id}`;
        let viaOtpData = {
            url: loginUri + urlAddon,
            header: { ...AuthorizeApiHeader, "password": otp, "Authorization": detail.authToken }
        }
        let socialData = {
            url: loginUri + `?client_id=${clientId}&client_type=${clientType}&auth_type=${detail.auth_type}&email_id=${detail.email}`,
            header: { ...AuthorizeApiHeader, "social_oauth_token": detail.oAuthToken, "Authorization": JSON.parse(AppConst.authToken) }
        }

        let requestData = otp ? viaOtpData : socialData;
        console.log('Request Data: ', requestData);

        const res = await PostRequest(requestData);
        console.log('login res:', res);
        if (res?.status == 200) {
            AppConst.showConsoleLog("res:", res);
            let token = JSON.stringify(res.data.token);
            let accountId = JSON.stringify(res.data.account_id);
            AppConst.setAccessToken(token);
            AppConst.setAccountId(res.data.account_id);
            AppConst.showConsoleLog('Access token:', token);
            await AsyncStorage.setItem('access_token', token);
            await AsyncStorage.setItem('account_id', accountId);
            return res;
        }
        if (res?.status == 400) {
            //wrong otp
        }
        Toast.show({
            type: "error",
            position: 'top',
            text1: res.message,
        })
        return res;
    }
    catch (error) {
        console.log(error)
    }
}



export const getFacebookUserData = async (token) => {
    return fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
        .then((response) => response.json())
        .then((json) => {
            // Some user object has been set up somewhere, build that user here
            let user = {}
            user.name = json.name
            user.id = json.id
            user.user_friends = json.friends
            user.email = json.email
            user.username = json.name
            user.loading = false
            user.loggedIn = true
            return user
        })
        .catch(() => {
            console.log('ERROR GETTING DATA FROM FACEBOOK')
        })
}



export const userLogout = () => {
    return async dispatch => {
        try {
            dispatch(setLoader(true));
            const res = await PostRequest({
                url: logoutUri + `?client_id=${AppConst.clientId}&client_type=${Platform.OS}&account_id=${AppConst.accountId}&token_type=access`,
                header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
                // body: {}
            });
            const deleteFcmRes = await removeFcmTokenAction();
            AppConst.showConsoleLog("remove fcm res: ", deleteFcmRes);
            AppConst.showConsoleLog("logout res:", res);
            dispatch(setLoader(false));
            // if (res?.status == 200) {
            AppConst.setAuthToken(null);
            AppConst.setAccessToken(null);
            AppConst.setAccountId(null);
            dispatch(setUserProfile(null));
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('account_id');
            dispatch(changeAppStatus(2));
            // }
            return true;
        } catch (error) {
            dispatch(setLoader(false));
            AppConst.showConsoleLog(error)
        }
    }
}


export const removeFcmTokenAction = async () => {
    try {
        const res = await PostRequest({
            url: removeFcmTokenUri,
            body: {
                "token_type": "access",
                "user_id": AppConst.accountId,
                "device_id": AppConst.deviceId
            }
        });

        return res;
    } catch (error) {
        return false
    }
}

export const getUserProfile = (currentAddress) => {
    return async dispatch => {
        try {
            console.log("userProfile: ", currentAddress);
            const res = await GetRequest({
                url: getUserProfileUri + "?account_id=" + AppConst.accountId + `&token_type=access&fetch_image=1`,
                header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            });
            AppConst.showConsoleLog("res:", res);
            if (res?.status == 200) {
                dispatch(setUserProfile({ ...res.data, currentAddress }));
                return res;
            }
            return false;
        } catch (error) {
            AppConst.showConsoleLog(error)
        }
    }
}



export const sendOtpToVerfiy = async (data, isMobile) => {
    let body = {}
    if (isMobile) {
        body = {
            "accountId": AppConst.accountId,
            "mobile_number": data.field,
            "country_code": data.countryCode,
            "tokenType": "access",
            "first_name": data.firstName,
            "last_name": data.lastName,
        }
    } else {
        body = {
            "accountId": AppConst.accountId,
            "emailId": data.field,
            "tokenType": "access",
            "first_name": data.firstName,
            "last_name": data.lastName,
        }
    }
    try {
        const res = await PostRequest({
            url: sendOtpUri,
            body: body,
            header: AuthorizeApiHeader
        });
        AppConst.showConsoleLog("res:", res);
        return res;
    } catch (error) {

    }
}


export const verifyOtp = async (otp, sessionId) => {
    try {
        const res = await PostRequest({
            url: verifyOtpUri,
            body: {
                "accountId": AppConst.accountId,
                "otp_session_id": sessionId,
                "otp": otp,
                "tokenType": "access"
            },
            header: AuthorizeApiHeader
        });
        AppConst.showConsoleLog("res:", res);
        return res;
    } catch (error) {

    }
}



export const editUserProfile = (data, oldProfile) => {
    return async dispatch => {
        try {
            dispatch(setLoader(true));
            const paramsUri = `account_id=${AppConst.accountId}&first_name=${data.firstName}&last_name=${data.lastName}&mobile_no=${data.mobile}&mobile_country_code=${data.countryCode}&country=${data.address.country}&city=${data.address.city}&token_type=access&is_promotion=${data.isPromotion}`;
            const res = await PostRequest({
                url: updateUserProfileUri + "?" + paramsUri,
                header: AuthorizeApiHeader,
                method: "PUT"
            });
            AppConst.showConsoleLog("res:", res);
            dispatch(setLoader(false));
            if (res?.status == 200) {
                // if (data.image) {
                //     dispatch(editUserImage(data.image, { ...res.data, currentAddress: data.address }));
                // } else {
                dispatch(setUserProfile({ ...oldProfile, ...res.data, currentAddress: data.address }));
                Toast.show({
                    type: "success",
                    position: 'top',
                    text1: res.message,
                })
                if (data.goBack) {
                    goBack();
                }
                // }
                return res;
            }
            return false;
        } catch (error) {
            dispatch(setLoader(false));
            AppConst.showConsoleLog(error)
        }
    }
}


export const editUserImage = (image, profileData) => {
    return async dispatch => {
        try {
            AppConst.showConsoleLog("image uploading", image);
            dispatch(setLoader(true));
            const formData = new FormData();
            formData.append('account_id', AppConst.accountId);
            formData.append('image_file', image);
            formData.append('token_type', 'access');
            formData.append("image_no", 1);

            const res = await PostRequest({
                url: userImnageUploadUri,
                header: { ...FormDataAuthApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
                method: "POST",
                fileupload: true,
                body: formData
            });
            AppConst.showConsoleLog("res:", res);
            dispatch(setLoader(false));
            if (res?.status == 200) {
                console.log("profileData", profileData);
                let img = res.data.profile_image_path ? res.data.profile_image_path : res.data.Profile_image_path
                console.log("profileData Image", img);
                let newData = {
                    ...profileData,
                    profile_image_path: img
                }
                dispatch(setUserProfile(newData));
                Toast.show({
                    type: "success",
                    position: 'top',
                    text1: "Image has been updated successfully",
                })
                // pop();
                return res;
            }
            return false;
        } catch (error) {
            dispatch(setLoader(false));
            AppConst.showConsoleLog(error)
        }
    }
}


export const getuserCredits = async (page) => {
    try {
        const res = await GetRequest({
            url: getCreditsUri + `?account_id=${AppConst.accountId}&token_type=access&page=${page}&size=10`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) }
        })
        if (res?.status == 200) {
            return res;
        }
        AppConst.showConsoleLog("res:", res);
        return false;
    } catch (error) {

    }
}



export const userPaymentCheckout = async (bookingId, lbCredits) => {
    try {
        const res = await PostRequest({
            url: userPaymentChekoutUri, //+ `?booking_id=${bookingId}&use_lb_credits=${lbCredits}`,
            header: AuthorizeApiHeader,
            body: {
                "account_id": AppConst.accountId,
                "booking_id": bookingId,
                "use_lb_credits": lbCredits
            }
        })
        return res;
    } catch (error) {

    }
}



export const createTransaction = async (data) => {
    try {
        const res = await PostRequest({
            url: createTransactionUri + `?account_id=${AppConst.accountId}&store_id=${data.storeId}&host_id=${data.hostId}&token_type=access&booking_id=${data.bookingId}&use_lb_credits=${data.lugbeeCredit}`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            body: {}
        })
        return res;

    } catch (error) {
        AppConst.showConsoleLog(error)
    }
}


export const refreshBookingStatus = async (bookingId) => {
    try {
        const res = await PostRequest({
            url: refreshBookingUri + `?account_id=${AppConst.accountId}&token_type=access&booking_id=${bookingId}`,
            header: AuthorizeApiHeader,
            body: {}
        })
        return res;

    } catch (error) {
        AppConst.showConsoleLog(error)
    }
}


export const getUserReviews = async () => {
    try {
        const res = await GetRequest({
            url: getReviewUri + `?user_id=${AppConst.accountId}&token_type=access&store_details=${1}`,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
        })
        return res;

    } catch (error) {
        AppConst.showConsoleLog(error)
    }
}


export const saveUserDeviceTokenAction = async () => {
    try {
        const res = await PostRequest({
            url: saveFcmTokenUri,
            header: { ...AuthorizeApiHeader, "Authorization": JSON.parse(AppConst.accessToken) },
            body: {
                "token": AppConst.deviceToken, //await AsyncStorage.getItem("fcmToken"),
                "user_id": AppConst.accountId,
                "device_id": AppConst.deviceId,
                "platform": Platform.OS
            }
        })
        return res;
    } catch (error) {
        AppConst.showConsoleLog(error)
    }
}